const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { uploadDocument, getByWallet, getDetails } = require('../controllers/documentController');

router.post('/upload', auth, uploadDocument);
router.get('/:walletAddress', auth, getByWallet);
router.get('/details/:id', auth, getDetails);

module.exports = router;
