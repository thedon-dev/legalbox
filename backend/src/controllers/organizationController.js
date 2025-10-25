const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');

const Document = require('../models/Document');
const Log = require('../models/Log');
const { hashBuffer } = require('../utils/hashUtils');
const { uploadBuffer } = require('../utils/ipfsUtils');
const { uploadStream } = require('../utils/cloudinaryUpload');
const { recordDocumentOnBlockDAG } = require('../utils/blockdagUtils');
const { sendNotification } = require('../utils/emailUtils');

/**
 * POST /api/organization/batch-upload
 * body: { entries: [{ fileBase64, name, description, ownerWallet, ownerEmail, isPublic }] }
 */
const batchUpload = asyncHandler(async (req, res) => {
  const { entries } = req.body;
  if (!Array.isArray(entries) || entries.length === 0) return res.status(400).json({ message: 'entries required' });

  // only organization role can call this (route already uses role middleware)
  const results = await Promise.all(entries.map(async (item) => {
    try {
      const { fileBase64, name, description, ownerWallet, ownerEmail, isPublic } = item;
      const buffer = Buffer.from(fileBase64, 'base64');
      const hash = hashBuffer(buffer);

      // upload IPFS
      let ipfsRes = null;
      try { ipfsRes = await uploadBuffer(buffer, name || uuidv4(), { uploadedAt: new Date().toISOString() }); } catch (e) { }

      // cloudinary
      const cloud = await uploadStream(buffer, uuidv4());

      const doc = await Document.create({
        name: name || 'batch_upload',
        description,
        hash,
        ipfsCid: ipfsRes ? ipfsRes.cid : undefined,
        cloudUrl: cloud.secure_url,
        ownerWallet: ownerWallet || req.user.walletAddress,
        isPublic: Boolean(isPublic),
        blockdagStatus: 'pending'
      });

      // record on BlockDAG
      try {
        const metadata = { ipfsCid: ipfsRes?.cid, cloudUrl: cloud.secure_url, name: doc.name, owner: doc.ownerWallet };
        const blockResp = await recordDocumentOnBlockDAG(hash, metadata);
        if (blockResp) {
          doc.blockdagTxId = blockResp.txId || blockResp.id || blockResp.transactionId;
          doc.blockdagStatus = blockResp.status || blockResp.confirmation || 'pending';
          // record the RPC endpoint used for the transaction
          doc.blockdagNode = process.env.BLOCKDAG_RPC_URL;
          await doc.save();
        }
      } catch (err) {
        // continue
      }

      await Log.create({ docId: doc._id, actionType: 'share', performedByWallet: req.user?.walletAddress, details: { action: 'batch-upload' } });
      if (ownerEmail) sendNotification({ to: ownerEmail, subject: 'Document uploaded by organization', text: `A document ${doc.name} was uploaded for you.` }).catch(() => {});
      return { success: true, docId: doc._id };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }));

  res.json({ results });
});

module.exports = { batchUpload };

