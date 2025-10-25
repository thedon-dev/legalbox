const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting DocumentManager deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Check balance
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");

  if (balance.lt(ethers.utils.parseEther("0.01"))) {
    console.log(
      "⚠️  Warning: Low balance. Make sure you have enough funds for deployment."
    );
  }

  // Deploy DocumentManager contract
  console.log("📄 Deploying DocumentManager contract...");
  const DocumentManager = await ethers.getContractFactory("DocumentManager");
  const documentManager = await DocumentManager.deploy();

  console.log("⏳ Waiting for deployment to be mined...");
  await documentManager.deployed();

  console.log("✅ DocumentManager deployed to:", documentManager.address);
  console.log("🔗 Transaction hash:", documentManager.deployTransaction.hash);

  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const totalDocuments = await documentManager.getTotalDocuments();
  console.log("📊 Initial document count:", totalDocuments.toString());

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: documentManager.address,
    deployer: deployer.address,
    transactionHash: documentManager.deployTransaction.hash,
    blockNumber: documentManager.deployTransaction.blockNumber,
    timestamp: new Date().toISOString(),
    gasUsed: documentManager.deployTransaction.gasLimit?.toString(),
  };

  console.log("\n📋 Deployment Summary:");
  console.log("=" * 50);
  console.log("Network:", deploymentInfo.network);
  console.log("Contract Address:", deploymentInfo.contractAddress);
  console.log("Deployer:", deploymentInfo.deployer);
  console.log("Transaction Hash:", deploymentInfo.transactionHash);
  console.log("Block Number:", deploymentInfo.blockNumber);
  console.log("Timestamp:", deploymentInfo.timestamp);
  console.log("=" * 50);

  // Save to file for future reference
  const fs = require("fs");
  const deploymentFile = `deployments/${hre.network.name}-${Date.now()}.json`;
  fs.mkdirSync("deployments", { recursive: true });
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Deployment info saved to: ${deploymentFile}`);

  // Instructions for verification
  console.log("\n🔐 Contract Verification Instructions:");
  console.log("1. Wait for the transaction to be confirmed on the blockchain");
  console.log(
    "2. Run: npx hardhat verify --network blockdag-testnet",
    documentManager.address
  );
  console.log("3. Or use the BlockDAG explorer to verify manually");

  return documentManager.address;
}

// Handle errors
main()
  .then((address) => {
    console.log("\n🎉 Deployment completed successfully!");
    console.log("📄 Contract Address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
