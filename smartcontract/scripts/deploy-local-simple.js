const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting DocumentManager deployment to local network...");

  try {
    // Get the contract factory
    const DocumentManager = await ethers.getContractFactory("DocumentManager");

    // Deploy the contract
    console.log("📄 Deploying DocumentManager contract...");
    const documentManager = await DocumentManager.deploy();

    // Wait for deployment to complete
    await documentManager.waitForDeployment();

    // Get the deployed contract address
    const contractAddress = await documentManager.getAddress();

    console.log("✅ DocumentManager deployed successfully!");
    console.log(`📍 Contract Address: ${contractAddress}`);
    console.log(`🔗 Network: Local Hardhat Network`);
    console.log(
      `⛽ Gas Used: ${documentManager
        .deploymentTransaction()
        .gasLimit.toString()}`
    );

    // Test basic functionality
    console.log("\n🧪 Testing basic functionality...");

    // Test document upload
    const testHash = "QmTestHash123";
    const testTitle = "Test Document";
    const testDescription = "A test document for verification";

    const uploadTx = await documentManager.uploadDocument(
      testHash,
      testTitle,
      testDescription
    );
    const uploadReceipt = await uploadTx.wait();

    console.log("✅ Test document uploaded successfully!");
    console.log(`📄 Document ID: 1`);
    console.log(`🔗 Transaction Hash: ${uploadTx.hash}`);

    // Test document retrieval
    const document = await documentManager.getDocument(1);
    console.log("✅ Document retrieved successfully!");
    console.log(`📄 Title: ${document.title}`);
    console.log(`🔗 Hash: ${document.docHash}`);

    // Test permission grant
    const [owner, user1] = await ethers.getSigners();
    const grantTx = await documentManager.grantPermission(1, user1.address);
    await grantTx.wait();

    console.log("✅ Permission granted successfully!");
    console.log(`👤 Granted to: ${user1.address}`);

    // Test permission check
    const hasPermission = await documentManager.hasPermission(1, user1.address);
    console.log(`✅ Permission check: ${hasPermission ? "Granted" : "Denied"}`);

    console.log("\n🎉 All tests passed! Contract is working correctly.");
    console.log("\n📋 Next Steps:");
    console.log("1. Copy the contract address above");
    console.log("2. Update your backend .env file:");
    console.log(`   BLOCKDAG_CONTRACT_ADDRESS=${contractAddress}`);
    console.log("3. Update your frontend .env.local file:");
    console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
    console.log("4. Start your backend and frontend applications");
    console.log("5. Test the complete integration!");
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
