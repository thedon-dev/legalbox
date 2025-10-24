import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const router = express.Router()

router.post("/register", async (req, res) => {
  try {
    const { email, password, walletAddress } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({
      email,
      passwordHash,
      walletAddress,
    })

    await user.save()

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    res.json({ token, user: { id: user._id, email: user.email } })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    res.json({ token, user: { id: user._id, email: user.email } })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
