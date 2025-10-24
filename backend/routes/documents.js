import express from "express"
import Document from "../models/Document.js"
import User from "../models/User.js"

const router = express.Router()

// Upload document
router.post("/upload", async (req, res) => {
  try {
    const { name, encryptedFileHash } = req.body
    const userId = req.userId

    if (!name || !encryptedFileHash) {
      return res.status(400).json({ error: "Name and file hash required" })
    }

    const document = new Document({
      owner: userId,
      name,
      encryptedFileHash,
      sharedWith: [],
    })

    await document.save()
    await document.populate("owner", "email")
    res.json(document)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all documents for user
router.get("/", async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId)

    const documents = await Document.find({
      $or: [{ owner: userId }, { sharedWith: { $in: [user.email] } }],
    }).populate("owner", "email")

    res.json(documents)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get document by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId)
    const document = await Document.findById(req.params.id).populate("owner", "email")

    if (!document) {
      return res.status(404).json({ error: "Document not found" })
    }

    // Check if user has access
    if (document.owner._id.toString() !== userId && !document.sharedWith.includes(user.email)) {
      return res.status(403).json({ error: "Access denied" })
    }

    res.json(document)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Share document
router.post("/:id/share", async (req, res) => {
  try {
    const userId = req.userId
    const { email } = req.body
    const document = await Document.findById(req.params.id)

    if (!document) {
      return res.status(404).json({ error: "Document not found" })
    }

    if (document.owner.toString() !== userId) {
      return res.status(403).json({ error: "Only owner can share" })
    }

    // Validate email exists
    const sharedUser = await User.findOne({ email })
    if (!sharedUser) {
      return res.status(400).json({ error: "User not found" })
    }

    if (!document.sharedWith.includes(email)) {
      document.sharedWith.push(email)
      await document.save()
    }

    await document.populate("owner", "email")
    res.json(document)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete document
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.userId
    const document = await Document.findById(req.params.id)

    if (!document) {
      return res.status(404).json({ error: "Document not found" })
    }

    if (document.owner.toString() !== userId) {
      return res.status(403).json({ error: "Only owner can delete" })
    }

    await Document.findByIdAndDelete(req.params.id)
    res.json({ message: "Document deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Remove shared access
router.post("/:id/unshare", async (req, res) => {
  try {
    const userId = req.userId
    const { email } = req.body
    const document = await Document.findById(req.params.id)

    if (!document) {
      return res.status(404).json({ error: "Document not found" })
    }

    if (document.owner.toString() !== userId) {
      return res.status(403).json({ error: "Only owner can manage sharing" })
    }

    document.sharedWith = document.sharedWith.filter((e) => e !== email)
    await document.save()

    await document.populate("owner", "email")
    res.json(document)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
