const asyncHandler = require("express-async-handler");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const Document = require("../models/Document");
const Log = require("../models/Log");
const { hashBuffer } = require("../utils/hashUtils");
const { uploadBuffer } = require("../utils/ipfsUtils");
const { uploadStream } = require("../utils/cloudinaryUpload");
const { sendNotification } = require("../utils/emailUtils");
const smartContractService = require("../services/smartContractService");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/documents/upload
const uploadDocument = [
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "File required" });
    const { name, description, isPublic } = req.body;
    const ownerWallet = req.user?.walletAddress || req.body.ownerWallet;
    if (!ownerWallet)
      return res.status(400).json({ message: "Owner wallet required" });

    // Hash file buffer
    const hash = hashBuffer(file.buffer);

    // Upload to IPFS (optional) - include light metadata to improve lookup
    let ipfsRes = null;
    try {
      ipfsRes = await uploadBuffer(file.buffer, file.originalname, {
        filename: file.originalname,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn(
        "IPFS upload failed; continuing with cloudinary only",
        err.message
      );
    }
    const ipfsCid = ipfsRes ? ipfsRes.cid : undefined;
    const ipfsMetaCid = ipfsRes ? ipfsRes.metadataCid : undefined;

    // Upload to Cloudinary
    const cloud = await uploadStream(file.buffer, uuidv4());

    // Save document record (include IPFS metadata CID if present)
    const doc = await Document.create({
      name: name || file.originalname,
      description,
      hash,
      ipfsCid,
      cloudUrl: cloud.secure_url,
      ownerWallet,
      isPublic: Boolean(isPublic),
      blockdagStatus: "pending",
    });

    // Record on BlockDAG Smart Contract
    try {
      if (smartContractService.canWrite()) {
        console.log("📄 Recording document on BlockDAG smart contract...");
        const blockchainResult = await smartContractService.uploadDocument(
          hash,
          doc.name,
          doc.description || "",
          ownerWallet
        );

        if (blockchainResult.success) {
          doc.blockdagTxId = blockchainResult.transactionHash;
          doc.blockdagStatus = "confirmed";
          doc.blockdagDocumentId = blockchainResult.documentId;
          doc.blockdagNode = process.env.BLOCKDAG_RPC_URL;
          await doc.save();

          console.log(
            `✅ Document recorded on blockchain with ID: ${blockchainResult.documentId}`
          );
        }
      } else {
        console.warn("⚠️ Smart contract not configured for write operations");
        doc.blockdagStatus = "pending";
        await doc.save();
      }
    } catch (err) {
      console.warn("❌ BlockDAG smart contract record failed:", err.message);
      doc.blockdagStatus = "failed";
      await doc.save();
    }

    // log
    await Log.create({
      docId: doc._id,
      actionType: "share",
      performedByWallet: ownerWallet,
      details: { action: "upload" },
    });

    // notify owner
    if (req.user?.email) {
      sendNotification({
        to: req.user.email,
        subject: "Document uploaded",
        text: `Your document ${doc.name} was uploaded.`,
      }).catch(() => {});
    }

    res.json({ doc });
  }),
];

// GET /api/documents/:walletAddress
const getByWallet = asyncHandler(async (req, res) => {
  const wallet = req.params.walletAddress;
  const docs = await Document.find({ ownerWallet: wallet }).sort({
    timestamp: -1,
  });
  res.json({ docs });
});

// GET /api/documents/details/:id
const getDetails = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const doc = await Document.findById(id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json({ doc });
});

// GET /api/documents/:id/blockdag
const getBlockdagStatus = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const doc = await Document.findById(id);
  if (!doc) return res.status(404).json({ message: "Not found" });

  res.json({
    status: doc.blockdagStatus || "pending",
    txId: doc.blockdagTxId,
    documentId: doc.blockdagDocumentId,
    node: doc.blockdagNode,
  });
});

module.exports = { uploadDocument, getByWallet, getDetails, getBlockdagStatus };
