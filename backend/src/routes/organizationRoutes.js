const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { batchUpload } = require('../controllers/organizationController');

router.post('/batch-upload', auth, role('organization'), batchUpload);

module.exports = router;
