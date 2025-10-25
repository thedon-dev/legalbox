const asyncHandler = require("express-async-handler");
const smartContractService = require("../services/smartContractService");

// GET /api/blockchain/status
const getBlockchainStatus = asyncHandler(async (req, res) => {
  try {
    const networkInfo = await smartContractService.getNetworkInfo();
    const totalDocuments = await smartContractService.getTotalDocuments();

    res.json({
      success: true,
      network: networkInfo,
      contract: {
        address: process.env.BLOCKDAG_CONTRACT_ADDRESS,
        configured: smartContractService.isConfigured(),
        canWrite: smartContractService.canWrite(),
      },
      stats: {
        totalDocuments: totalDocuments.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get blockchain status",
      error: error.message,
    });
  }
});

// POST /api/blockchain/documents/upload
const uploadDocumentToBlockchain = asyncHandler(async (req, res) => {
  const { docHash, title, description, ownerAddress } = req.body;

  if (!docHash || !title || !ownerAddress) {
    return res.status(400).json({
      success: false,
      message: "docHash, title, and ownerAddress are required",
    });
  }

  try {
    const result = await smartContractService.uploadDocument(
      docHash,
      title,
      description || "",
      ownerAddress
    );

    res.json({
      success: true,
      message: "Document uploaded to blockchain successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload document to blockchain",
      error: error.message,
    });
  }
});

// POST /api/blockchain/documents/:documentId/grant-permission
const grantPermission = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { toAddress } = req.body;

  if (!toAddress) {
    return res.status(400).json({
      success: false,
      message: "toAddress is required",
    });
  }

  try {
    const result = await smartContractService.grantPermission(
      parseInt(documentId),
      toAddress
    );

    res.json({
      success: true,
      message: "Permission granted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to grant permission",
      error: error.message,
    });
  }
});

// POST /api/blockchain/documents/:documentId/revoke-permission
const revokePermission = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { fromAddress } = req.body;

  if (!fromAddress) {
    return res.status(400).json({
      success: false,
      message: "fromAddress is required",
    });
  }

  try {
    const result = await smartContractService.revokePermission(
      parseInt(documentId),
      fromAddress
    );

    res.json({
      success: true,
      message: "Permission revoked successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to revoke permission",
      error: error.message,
    });
  }
});

// POST /api/blockchain/documents/:documentId/transfer-ownership
const transferOwnership = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { newOwnerAddress } = req.body;

  if (!newOwnerAddress) {
    return res.status(400).json({
      success: false,
      message: "newOwnerAddress is required",
    });
  }

  try {
    const result = await smartContractService.transferOwnership(
      parseInt(documentId),
      newOwnerAddress
    );

    res.json({
      success: true,
      message: "Ownership transferred successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to transfer ownership",
      error: error.message,
    });
  }
});

// GET /api/blockchain/documents/my/:userAddress
const getMyDocuments = asyncHandler(async (req, res) => {
  const { userAddress } = req.params;

  try {
    const documentIds = await smartContractService.getMyDocuments(userAddress);

    // Get document details for each ID
    const documents = [];
    for (const docId of documentIds) {
      try {
        const doc = await smartContractService.getDocument(docId);
        documents.push({
          id: docId,
          ...doc,
        });
      } catch (error) {
        console.warn(
          `Failed to get details for document ${docId}:`,
          error.message
        );
      }
    }

    res.json({
      success: true,
      documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user documents",
      error: error.message,
    });
  }
});

// GET /api/blockchain/documents/shared/:userAddress
const getSharedDocuments = asyncHandler(async (req, res) => {
  const { userAddress } = req.params;

  try {
    const documentIds = await smartContractService.getSharedDocuments(
      userAddress
    );

    // Get document details for each ID
    const documents = [];
    for (const docId of documentIds) {
      try {
        const doc = await smartContractService.getDocument(docId);
        documents.push({
          id: docId,
          ...doc,
        });
      } catch (error) {
        console.warn(
          `Failed to get details for document ${docId}:`,
          error.message
        );
      }
    }

    res.json({
      success: true,
      documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get shared documents",
      error: error.message,
    });
  }
});

// GET /api/blockchain/documents/:documentId
const getDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;

  try {
    const document = await smartContractService.getDocument(
      parseInt(documentId)
    );

    res.json({
      success: true,
      document: {
        id: parseInt(documentId),
        ...document,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get document",
      error: error.message,
    });
  }
});

// GET /api/blockchain/documents/:documentId/permission/:userAddress
const checkPermission = asyncHandler(async (req, res) => {
  const { documentId, userAddress } = req.params;

  try {
    const hasPermission = await smartContractService.hasPermission(
      parseInt(documentId),
      userAddress
    );

    res.json({
      success: true,
      hasPermission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check permission",
      error: error.message,
    });
  }
});

module.exports = {
  getBlockchainStatus,
  uploadDocumentToBlockchain,
  grantPermission,
  revokePermission,
  transferOwnership,
  getMyDocuments,
  getSharedDocuments,
  getDocument,
  checkPermission,
};
