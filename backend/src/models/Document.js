const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  hash: { type: String, required: true, index: true },
  ipfsCid: { type: String },
  cloudUrl: { type: String },
  ownerWallet: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now },
  isPublic: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  downloadCount: { type: Number, default: 0 },
  verificationCount: { type: Number, default: 0 },
  onChainTx: { type: String },
  blockdagTxId: { type: String },
  blockdagStatus: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
  blockdagNode: { type: String }
});

module.exports = mongoose.model('Document', DocumentSchema);
