const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createShare, accessShare, revokeShare } = require('../controllers/shareController');

router.post('/:docId', auth, createShare);
router.get('/:linkId', accessShare);
router.post('/:linkId/revoke', auth, revokeShare);

module.exports = router;
