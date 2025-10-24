import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import documentRoutes from "./routes/documents.js"
import { verifyToken } from "./middleware/auth.js"

dotenv.config()

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/legalbox")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/documents", verifyToken, documentRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
