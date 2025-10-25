const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, index: true },
  organization: { type: String },
  roleType: { type: String, enum: ['individual', 'organization'], default: 'individual' },
  walletAddress: { type: String, index: true },
  passwordHash: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
