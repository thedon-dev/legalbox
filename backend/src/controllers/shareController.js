const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');

const ShareLink = require('../models/ShareLink');
const Document = require('../models/Document');
const Log = require('../models/Log');
const { sendNotification } = require('../utils/emailUtils');

// POST /api/share/:docId
const createShare = asyncHandler(async (req, res) => {
  const { docId } = req.params;
  const { accessCode, expiresInHours } = req.body;
  const doc = await Document.findById(docId);
  if (!doc) return res.status(404).json({ message: 'Document not found' });
  // only owner or organization role allowed
  if (req.user && req.user.walletAddress !== doc.ownerWallet && req.user.roleType !== 'organization') return res.status(403).json({ message: 'Forbidden' });

  const linkId = uuidv4();
  const expiresAt = expiresInHours ? new Date(Date.now() + Number(expiresInHours) * 3600 * 1000) : null;
  const share = await ShareLink.create({ docId, linkId, accessCode, expiresAt });

  await Log.create({ docId, actionType: 'share', performedByWallet: req.user?.walletAddress, details: { linkId } });

  // notify owner
  if (req.user?.email) sendNotification({ to: req.user.email, subject: 'Document shared', text: `Your document ${doc.name} was shared.` }).catch(() => {});

  res.json({ share });
});

// GET /api/share/:linkId
const accessShare = asyncHandler(async (req, res) => {
  const { linkId } = req.params;
  const { code } = req.query;
  const link = await ShareLink.findOne({ linkId }).populate('docId');
  if (!link) return res.status(404).json({ message: 'Link not found' });
  if (link.revoked) return res.status(403).json({ message: 'Link revoked' });
  if (link.expiresAt && link.expiresAt < new Date()) return res.status(403).json({ message: 'Link expired' });
  if (link.accessCode && link.accessCode !== code) return res.status(403).json({ message: 'Invalid code' });

  // increment view count
  const doc = link.docId;
  doc.viewCount = (doc.viewCount || 0) + 1;
  await doc.save();

  await Log.create({ docId: doc._id, actionType: 'view', performedByWallet: req.user?.walletAddress });

  res.json({ doc });
});

// POST /api/share/:linkId/revoke
const revokeShare = asyncHandler(async (req, res) => {
  const { linkId } = req.params;
  const link = await ShareLink.findOne({ linkId }).populate('docId');
  if (!link) return res.status(404).json({ message: 'Link not found' });
  const doc = link.docId;
  if (req.user && req.user.walletAddress !== doc.ownerWallet && req.user.roleType !== 'organization') return res.status(403).json({ message: 'Forbidden' });
  link.revoked = true;
  await link.save();
  await Log.create({ docId: doc._id, actionType: 'revoke', performedByWallet: req.user?.walletAddress });
  if (req.user?.email) sendNotification({ to: req.user.email, subject: 'Share revoked', text: `Share link for ${doc.name} was revoked.` }).catch(() => {});
  res.json({ link });
});

module.exports = { createShare, accessShare, revokeShare };
