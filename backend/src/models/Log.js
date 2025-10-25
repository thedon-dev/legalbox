const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  docId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  actionType: { type: String, enum: ['view', 'verify', 'share', 'revoke', 'download'], required: true },
  performedByWallet: { type: String },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);
