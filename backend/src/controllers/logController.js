const asyncHandler = require("express-async-handler");
const Log = require("../models/Log");

// GET /api/logs or /api/logs/:docId
const getLogs = asyncHandler(async (req, res) => {
  const { docId } = req.params;
  const { limit = 50, skip = 0 } = req.query;

  let query = {};
  if (docId) {
    query.docId = docId;
  }

  const logs = await Log.find(query)
    .sort({ timestamp: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  res.json({ logs });
});

module.exports = { getLogs };
