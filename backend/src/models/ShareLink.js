const mongoose = require('mongoose');

const ShareLinkSchema = new mongoose.Schema({
  docId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  linkId: { type: String, required: true, index: true },
  accessCode: { type: String },
  expiresAt: { type: Date },
  revoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShareLink', ShareLinkSchema);
