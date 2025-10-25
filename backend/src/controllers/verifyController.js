const asyncHandler = require('express-async-handler');
const { hashBuffer } = require('../utils/hashUtils');
const { fetchDocumentRecord } = require('../utils/blockdagUtils');
const Document = require('../models/Document');
const Log = require('../models/Log');

// POST /api/verify
// Accepts file upload (multipart/form-data) or { hash }
const verify = asyncHandler(async (req, res) => {
  let providedHash = req.body.hash;
  if (req.file && req.file.buffer) {
    providedHash = hashBuffer(req.file.buffer);
  }
  if (!providedHash) return res.status(400).json({ message: 'Provide file or hash' });

  // Also search DB as a primary source
  const doc = await Document.findOne({ hash: providedHash });

  let blockdagRecord = null;
  if (doc && doc.blockdagTxId) {
    try {
      blockdagRecord = await fetchDocumentRecord(doc.blockdagTxId);
    } catch (err) {
      console.warn('Failed to fetch BlockDAG record:', err.message);
    }
  }

  const matched = Boolean(doc || blockdagRecord);

  // log verification (include blockdag status if available)
  await Log.create({ docId: doc?._id, actionType: 'verify', performedByWallet: req.user?.walletAddress, details: { hash: providedHash, matched, blockdagStatus: blockdagRecord?.status } });

  res.json({ authentic: matched, document: doc, blockdagRecord });
});

module.exports = { verify };
