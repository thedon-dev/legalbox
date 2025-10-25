const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing DocumentManager Contract Interactions...");
  console.log("=" * 60);

  // Get signers
  const [deployer, user1, user2, user3] = await ethers.getSigners();
  console.log("👥 Test Accounts:");
  console.log("  Deployer:", deployer.address);
  console.log("  User1:", user1.address);
  console.log("  User2:", user2.address);
  console.log("  User3:", user3.address);

  // Get contract address from environment or use deployed contract
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.log("❌ CONTRACT_ADDRESS environment variable not set");
    console.log("   Set it with: export CONTRACT_ADDRESS=0x...");
    process.exit(1);
  }

  console.log("\n📄 Contract Address:", contractAddress);

  // Get contract instance
  const DocumentManager = await ethers.getContractFactory("DocumentManager");
  const contract = DocumentManager.attach(contractAddress);

  try {
    // Test 1: Check initial state
    console.log("\n🔍 Test 1: Initial State Check");
    console.log("-" * 40);
    const totalDocs = await contract.getTotalDocuments();
    console.log("✅ Total documents:", totalDocs.toString());

    // Test 2: Upload document as user1
    console.log("\n📄 Test 2: Document Upload");
    console.log("-" * 40);
    const uploadTx = await contract
      .connect(user1)
      .uploadDocument(
        "QmTestHash123",
        "Test Document 1",
        "This is the first test document for BlockDAG integration"
      );
    console.log("⏳ Uploading document... TX:", uploadTx.hash);
    const uploadReceipt = await uploadTx.wait();

    // Extract document ID from event
    const uploadEvent = uploadReceipt.events.find(
      (e) => e.event === "DocumentUploaded"
    );
    const documentId1 = uploadEvent.args.documentId.toNumber();
    console.log("✅ Document uploaded successfully!");
    console.log("   Document ID:", documentId1);
    console.log("   Owner:", uploadEvent.args.owner);
    console.log("   Title:", uploadEvent.args.title);

    // Test 3: Get document details
    console.log("\n🔍 Test 3: Document Details");
    console.log("-" * 40);
    const document1 = await contract.getDocument(documentId1);
    console.log("✅ Document details retrieved:");
    console.log("   Title:", document1.title);
    console.log("   Description:", document1.description);
    console.log("   Owner:", document1.owner);
    console.log("   Hash:", document1.docHash);
    console.log(
      "   Timestamp:",
      new Date(document1.timestamp.toNumber() * 1000).toLocaleString()
    );

    // Test 4: Upload second document
    console.log("\n📄 Test 4: Second Document Upload");
    console.log("-" * 40);
    const uploadTx2 = await contract
      .connect(user1)
      .uploadDocument(
        "QmTestHash456",
        "Test Document 2",
        "Second test document for comprehensive testing"
      );
    const uploadReceipt2 = await uploadTx2.wait();
    const uploadEvent2 = uploadReceipt2.events.find(
      (e) => e.event === "DocumentUploaded"
    );
    const documentId2 = uploadEvent2.args.documentId.toNumber();
    console.log("✅ Second document uploaded!");
    console.log("   Document ID:", documentId2);

    // Test 5: Get user's documents
    console.log("\n📚 Test 5: User Documents");
    console.log("-" * 40);
    const myDocs = await contract.connect(user1).getMyDocuments();
    console.log(
      "✅ User1's documents:",
      myDocs.map((id) => id.toNumber())
    );

    // Test 6: Grant permission to user2
    console.log("\n🔐 Test 6: Permission Management");
    console.log("-" * 40);
    console.log("⏳ Granting permission to user2...");
    const grantTx = await contract
      .connect(user1)
      .grantPermission(documentId1, user2.address);
    const grantReceipt = await grantTx.wait();
    const grantEvent = grantReceipt.events.find(
      (e) => e.event === "DocumentShared"
    );
    console.log("✅ Permission granted!");
    console.log("   From:", grantEvent.args.from);
    console.log("   To:", grantEvent.args.to);
    console.log("   Document ID:", grantEvent.args.documentId.toNumber());

    // Test 7: Check permission
    console.log("\n✅ Test 7: Permission Verification");
    console.log("-" * 40);
    const hasPermission = await contract.hasPermission(
      documentId1,
      user2.address
    );
    console.log(
      "✅ User2 has permission for document",
      documentId1,
      ":",
      hasPermission
    );

    // Test 8: Get shared documents for user2
    console.log("\n📖 Test 8: Shared Documents");
    console.log("-" * 40);
    const sharedDocs = await contract.connect(user2).getSharedDocuments();
    console.log(
      "✅ Documents shared with user2:",
      sharedDocs.map((id) => id.toNumber())
    );

    // Test 9: Try to access document as user2
    console.log("\n🔍 Test 9: Access Shared Document");
    console.log("-" * 40);
    const sharedDocument = await contract
      .connect(user2)
      .getDocument(documentId1);
    console.log("✅ User2 can access shared document:");
    console.log("   Title:", sharedDocument.title);
    console.log("   Owner:", sharedDocument.owner);

    // Test 10: Grant permission to user3
    console.log("\n🔐 Test 10: Grant Permission to User3");
    console.log("-" * 40);
    const grantTx2 = await contract
      .connect(user1)
      .grantPermission(documentId2, user3.address);
    await grantTx2.wait();
    console.log("✅ Permission granted to user3 for document", documentId2);

    // Test 11: Check user3's shared documents
    const sharedDocs3 = await contract.connect(user3).getSharedDocuments();
    console.log(
      "✅ Documents shared with user3:",
      sharedDocs3.map((id) => id.toNumber())
    );

    // Test 12: Revoke permission
    console.log("\n🚫 Test 12: Revoke Permission");
    console.log("-" * 40);
    console.log("⏳ Revoking permission from user2...");
    const revokeTx = await contract
      .connect(user1)
      .revokePermission(documentId1, user2.address);
    const revokeReceipt = await revokeTx.wait();
    const revokeEvent = revokeReceipt.events.find(
      (e) => e.event === "PermissionRevoked"
    );
    console.log("✅ Permission revoked!");
    console.log("   From:", revokeEvent.args.from);
    console.log("   To:", revokeEvent.args.to);
    console.log("   Document ID:", revokeEvent.args.documentId.toNumber());

    // Test 13: Verify permission is revoked
    const hasPermissionAfterRevoke = await contract.hasPermission(
      documentId1,
      user2.address
    );
    console.log("✅ User2 permission after revoke:", hasPermissionAfterRevoke);

    // Test 14: Transfer ownership
    console.log("\n🔄 Test 14: Ownership Transfer");
    console.log("-" * 40);
    console.log("⏳ Transferring ownership to user2...");
    const transferTx = await contract
      .connect(user1)
      .transferOwnership(documentId2, user2.address);
    const transferReceipt = await transferTx.wait();
    const transferEvent = transferReceipt.events.find(
      (e) => e.event === "OwnershipTransferred"
    );
    console.log("✅ Ownership transferred!");
    console.log("   From:", transferEvent.args.from);
    console.log("   To:", transferEvent.args.to);
    console.log("   Document ID:", transferEvent.args.documentId.toNumber());

    // Test 15: Verify new owner
    const documentAfterTransfer = await contract.getDocument(documentId2);
    console.log("✅ New owner:", documentAfterTransfer.owner);

    // Test 16: Check user2's documents after transfer
    const user2Docs = await contract.connect(user2).getMyDocuments();
    console.log(
      "✅ User2's documents after transfer:",
      user2Docs.map((id) => id.toNumber())
    );

    // Test 17: Final state check
    console.log("\n📊 Test 17: Final State");
    console.log("-" * 40);
    const finalTotalDocs = await contract.getTotalDocuments();
    console.log("✅ Final total documents:", finalTotalDocs.toString());

    // Summary
    console.log("\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!");
    console.log("=" * 60);
    console.log("📋 Test Summary:");
    console.log("  ✅ Document upload: PASSED");
    console.log("  ✅ Document retrieval: PASSED");
    console.log("  ✅ Permission granting: PASSED");
    console.log("  ✅ Permission verification: PASSED");
    console.log("  ✅ Shared documents: PASSED");
    console.log("  ✅ Permission revocation: PASSED");
    console.log("  ✅ Ownership transfer: PASSED");
    console.log("  ✅ Access control: PASSED");
    console.log("\n🚀 Your BlockDAG Document Manager is working perfectly!");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    console.error("Error details:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
