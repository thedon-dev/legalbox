const asyncHandler = require('express-async-handler');
const Log = require('../models/Log');

// GET /api/logs/:docId
const getLogs = asyncHandler(async (req, res) => {
  const { docId } = req.params;
  const logs = await Log.find({ docId }).sort({ timestamp: -1 });
  res.json({ logs });
});

module.exports = { getLogs };
