const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const auth = require('../middleware/authMiddleware');
const { verify } = require('../controllers/verifyController');

router.post('/', auth, upload.single('file'), verify);

module.exports = router;
