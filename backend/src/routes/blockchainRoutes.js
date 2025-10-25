const express = require("express");
const router = express.Router();
const {
  getBlockchainStatus,
  uploadDocumentToBlockchain,
  grantPermission,
  revokePermission,
  transferOwnership,
  getMyDocuments,
  getSharedDocuments,
  getDocument,
  checkPermission,
} = require("../controllers/blockchainController");

// Blockchain status and info
router.get("/status", getBlockchainStatus);

// Document operations
router.post("/documents/upload", uploadDocumentToBlockchain);
router.get("/documents/:documentId", getDocument);

// Permission management
router.post("/documents/:documentId/grant-permission", grantPermission);
router.post("/documents/:documentId/revoke-permission", revokePermission);
router.get("/documents/:documentId/permission/:userAddress", checkPermission);

// Ownership management
router.post("/documents/:documentId/transfer-ownership", transferOwnership);

// User document queries
router.get("/documents/my/:userAddress", getMyDocuments);
router.get("/documents/shared/:userAddress", getSharedDocuments);

module.exports = router;
