const asyncHandler = require('express-async-handler');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const Document = require('../models/Document');
const Log = require('../models/Log');
const { hashBuffer } = require('../utils/hashUtils');
const { uploadBuffer } = require('../utils/ipfsUtils');
const { uploadStream } = require('../utils/cloudinaryUpload');
const { sendNotification } = require('../utils/emailUtils');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/documents/upload
const uploadDocument = [
  upload.single('file'),
  asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'File required' });
    const { name, description, isPublic } = req.body;
    const ownerWallet = req.user?.walletAddress || req.body.ownerWallet;
    if (!ownerWallet) return res.status(400).json({ message: 'Owner wallet required' });

    // Hash file buffer
    const hash = hashBuffer(file.buffer);

    // Upload to IPFS (optional) - include light metadata to improve lookup
    let ipfsRes = null;
    try {
      ipfsRes = await uploadBuffer(file.buffer, file.originalname, { filename: file.originalname, size: file.size, uploadedAt: new Date().toISOString() });
    } catch (err) {
      console.warn('IPFS upload failed; continuing with cloudinary only', err.message);
    }
    const ipfsCid = ipfsRes ? ipfsRes.cid : undefined;
    const ipfsMetaCid = ipfsRes ? ipfsRes.metadataCid : undefined;

    // Upload to Cloudinary
    const cloud = await uploadStream(file.buffer, uuidv4());

    // Save document record (include IPFS metadata CID if present)
    const doc = await Document.create({
      name: name || file.originalname,
      description,
      hash,
      ipfsCid,
      cloudUrl: cloud.secure_url,
      ownerWallet,
      isPublic: Boolean(isPublic),
      blockdagStatus: 'pending'
    });

    // Record on BlockDAG
    try {
      const metadata = { ipfsCid, ipfsMetaCid, cloudUrl: cloud.secure_url, name: doc.name, owner: ownerWallet };
      const blockResp = await require('../utils/blockdagUtils').recordDocumentOnBlockDAG(hash, metadata);
      if (blockResp) {
        doc.blockdagTxId = blockResp.txId || blockResp.id || blockResp.transactionId;
        doc.blockdagStatus = blockResp.status || blockResp.confirmation || 'pending';
        // record the RPC endpoint used for the transaction
        doc.blockdagNode = process.env.BLOCKDAG_RPC_URL;
        await doc.save();
      }
    } catch (err) {
      console.warn('BlockDAG record failed:', err.message);
    }

    // log
    await Log.create({ docId: doc._id, actionType: 'share', performedByWallet: ownerWallet, details: { action: 'upload' } });

    // notify owner
    if (req.user?.email) {
      sendNotification({ to: req.user.email, subject: 'Document uploaded', text: `Your document ${doc.name} was uploaded.` }).catch(() => {});
    }

    res.json({ doc });
  })
];

// GET /api/documents/:walletAddress
const getByWallet = asyncHandler(async (req, res) => {
  const wallet = req.params.walletAddress;
  const docs = await Document.find({ ownerWallet: wallet }).sort({ timestamp: -1 });
  res.json({ docs });
});

// GET /api/documents/details/:id
const getDetails = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const doc = await Document.findById(id);
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json({ doc });
});

module.exports = { uploadDocument, getByWallet, getDetails };
