import mongoose from "mongoose"

const documentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  encryptedFileHash: {
    type: String,
    required: true,
  },
  sharedWith: [
    {
      type: String, // email or wallet address
      default: [],
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Document", documentSchema)
