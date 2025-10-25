const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");
const smartContractService = require("./services/smartContractService");

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    // Initialize smart contract service
    try {
      await smartContractService.initialize();
    } catch (error) {
      console.warn(
        "⚠️ Smart contract service initialization failed:",
        error.message
      );
      console.warn(
        "   Blockchain features will be limited. Check your configuration."
      );
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `📄 Smart contract configured: ${smartContractService.isConfigured()}`
      );
      console.log(
        `✍️  Smart contract write operations: ${smartContractService.canWrite()}`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });
