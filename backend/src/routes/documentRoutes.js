const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  uploadDocument,
  getByWallet,
  getDetails,
  getBlockdagStatus,
} = require("../controllers/documentController");

router.post("/upload", auth, uploadDocument);
router.get("/:walletAddress", auth, getByWallet);
router.get("/details/:id", auth, getDetails);
router.get("/:id", auth, getDetails);
router.get("/:id/blockdag", auth, getBlockdagStatus);

module.exports = router;
