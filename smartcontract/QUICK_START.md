# 🚀 BlockDAG Smart Contract - Quick Start Guide

This guide will help you deploy the DocumentManager smart contract to BlockDAG testnet and test all interactions.

## 📋 Prerequisites

Before starting, ensure you have:

- [ ] **Node.js v16+** installed
- [ ] **MetaMask** or compatible wallet
- [ ] **BlockDAG testnet tokens** (get from [faucet](https://testnet.blockdag.network/faucet))
- [ ] **Private key** for deployment account

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
cd smartcontract
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp env.example .env

# Edit with your private key
nano .env
```

**Required .env content:**

```bash
PRIVATE_KEY=0x1234567890abcdef...  # Your wallet private key
BLOCKDAG_RPC_URL=https://testnet.blockdag.network
```

### 3. Compile & Test

```bash
# Compile contracts
npm run compile

# Run tests
npm test
```

**Expected test output:**

```
  DocumentManager
    Document Upload
      ✓ Should upload a document successfully
      ✓ Should reject empty document hash
      ✓ Should reject empty title
    Document Permissions
      ✓ Should grant permission successfully
      ✓ Should revoke permission successfully
      ✓ Should reject permission grant from non-owner
      ✓ Should reject permission grant to zero address
    Document Queries
      ✓ Should return user's documents
      ✓ Should return shared documents
      ✓ Should check permission correctly
    Ownership Transfer
      ✓ Should transfer ownership successfully
      ✓ Should reject transfer from non-owner

  11 passing
```

## 🚀 Deploy to BlockDAG Testnet

### Deploy Contract

```bash
npm run deploy
```

**Expected deployment output:**

```
🚀 Starting DocumentManager deployment...
📝 Deploying contracts with account: 0x1234...
💰 Account balance: 1.5 ETH
📄 Deploying DocumentManager contract...
⏳ Waiting for deployment to be mined...
✅ DocumentManager deployed to: 0xabcd1234567890...
🔗 Transaction hash: 0xefgh5678901234...
📊 Initial document count: 0

📋 Deployment Summary:
==================================================
Network: blockdag-testnet
Contract Address: 0xabcd1234567890...
Deployer: 0x1234...
Transaction Hash: 0xefgh5678901234...
Block Number: 12345
Timestamp: 2024-01-01T12:00:00.000Z
==================================================

💾 Deployment info saved to: deployments/blockdag-testnet-1234567890.json
```

### Save Contract Address

```bash
# Copy the deployed contract address
export CONTRACT_ADDRESS=0xabcd1234567890...
```

## 🧪 Test Contract Interactions

### 1. Basic Contract Test

```bash
# Create a test script
cat > test-interactions.js << 'EOF'
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS || "0x..."; // Your deployed address
  const [deployer, user1, user2] = await ethers.getSigners();

  console.log("🧪 Testing DocumentManager contract...");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer:", deployer.address);

  // Get contract instance
  const DocumentManager = await ethers.getContractFactory("DocumentManager");
  const contract = DocumentManager.attach(contractAddress);

  // Test 1: Check initial state
  console.log("\n📊 Initial State:");
  const totalDocs = await contract.getTotalDocuments();
  console.log("Total documents:", totalDocs.toString());

  // Test 2: Upload a document
  console.log("\n📄 Uploading document...");
  const uploadTx = await contract.connect(user1).uploadDocument(
    "QmTestHash123",
    "Test Document",
    "This is a test document for BlockDAG"
  );
  const uploadReceipt = await uploadTx.wait();
  console.log("✅ Document uploaded! TX:", uploadTx.hash);

  // Extract document ID from event
  const uploadEvent = uploadReceipt.events.find(e => e.event === "DocumentUploaded");
  const documentId = uploadEvent.args.documentId.toNumber();
  console.log("📋 Document ID:", documentId);

  // Test 3: Get document details
  console.log("\n🔍 Document Details:");
  const document = await contract.getDocument(documentId);
  console.log("Title:", document.title);
  console.log("Description:", document.description);
  console.log("Owner:", document.owner);
  console.log("Hash:", document.docHash);

  // Test 4: Check user's documents
  console.log("\n📚 User's Documents:");
  const myDocs = await contract.connect(user1).getMyDocuments();
  console.log("My documents:", myDocs.map(id => id.toNumber()));

  // Test 5: Grant permission
  console.log("\n🔐 Granting permission...");
  const grantTx = await contract.connect(user1).grantPermission(documentId, user2.address);
  await grantTx.wait();
  console.log("✅ Permission granted! TX:", grantTx.hash);

  // Test 6: Check permission
  console.log("\n✅ Permission Check:");
  const hasPermission = await contract.hasPermission(documentId, user2.address);
  console.log("User2 has permission:", hasPermission);

  // Test 7: Get shared documents
  console.log("\n📖 Shared Documents:");
  const sharedDocs = await contract.connect(user2).getSharedDocuments();
  console.log("Documents shared with user2:", sharedDocs.map(id => id.toNumber()));

  console.log("\n🎉 All tests completed successfully!");
}

main().catch((error) => {
  console.error("❌ Test failed:", error);
  process.exit(1);
});
EOF

# Run the test
CONTRACT_ADDRESS=0xabcd1234567890... npx hardhat run test-interactions.js --network blockdag-testnet
```

### 2. Frontend Integration Test

Create a simple HTML test page:

```bash
cat > test-frontend.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>BlockDAG Document Manager Test</title>
    <script src="https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js"></script>
</head>
<body>
    <h1>BlockDAG Document Manager Test</h1>
    <div id="status">Connecting...</div>
    <button id="connect">Connect Wallet</button>
    <button id="upload">Upload Test Document</button>
    <div id="results"></div>

    <script>
        const CONTRACT_ADDRESS = "0xabcd1234567890..."; // Replace with your deployed address
        const CONTRACT_ABI = [
            "function uploadDocument(string memory docHash, string memory title, string memory description) external returns (uint256)",
            "function getMyDocuments() external view returns (uint256[] memory)",
            "function getDocument(uint256 documentId) external view returns (tuple(string docHash, string title, string description, address owner, uint256 timestamp))",
            "event DocumentUploaded(uint256 indexed documentId, address indexed owner, string docHash, string title)"
        ];

        let provider, signer, contract;

        document.getElementById('connect').onclick = async () => {
            if (typeof window.ethereum !== 'undefined') {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();
                contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

                const address = await signer.getAddress();
                document.getElementById('status').innerHTML = `Connected: ${address}`;
                document.getElementById('results').innerHTML = 'Wallet connected successfully!';
            } else {
                document.getElementById('results').innerHTML = 'MetaMask not found!';
            }
        };

        document.getElementById('upload').onclick = async () => {
            if (!contract) {
                document.getElementById('results').innerHTML = 'Please connect wallet first!';
                return;
            }

            try {
                const tx = await contract.uploadDocument(
                    "QmTestHash" + Date.now(),
                    "Test Document " + new Date().toLocaleTimeString(),
                    "Test document uploaded from frontend"
                );

                document.getElementById('results').innerHTML = `Uploading... TX: ${tx.hash}`;

                const receipt = await tx.wait();
                const event = receipt.events.find(e => e.event === 'DocumentUploaded');
                const documentId = event.args.documentId.toNumber();

                document.getElementById('results').innerHTML = `
                    ✅ Document uploaded successfully!<br>
                    Document ID: ${documentId}<br>
                    Transaction: ${tx.hash}
                `;
            } catch (error) {
                document.getElementById('results').innerHTML = `Error: ${error.message}`;
            }
        };
    </script>
</body>
</html>
EOF

echo "Open test-frontend.html in your browser to test frontend integration"
```

## 🔍 Verify Deployment

### 1. Check on BlockDAG Explorer

1. Go to [BlockDAG Testnet Explorer](https://testnet.blockdag.network)
2. Search for your contract address
3. Verify the contract is deployed and has the correct code

### 2. Verify Contract Code

```bash
# Optional: Verify contract source code
npx hardhat verify --network blockdag-testnet 0xYOUR_CONTRACT_ADDRESS
```

## 🌐 Frontend Integration

### 1. Add to Your Next.js App

```typescript
// In your dashboard page
import { DocumentManagerComponent } from "../components/blockdag/DocumentManagerComponent";

export default function Dashboard() {
  const contractAddress = "0xabcd1234567890..."; // Your deployed contract address

  return (
    <div>
      <h1>LegalBox Dashboard</h1>
      <DocumentManagerComponent contractAddress={contractAddress} />
    </div>
  );
}
```

### 2. Environment Configuration

Create `.env.local` in your frontend:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xabcd1234567890...
NEXT_PUBLIC_BLOCKDAG_RPC_URL=https://testnet.blockdag.network
```

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. "Insufficient funds"

```bash
# Check your balance
npx hardhat run scripts/check-balance.js --network blockdag-testnet

# Get testnet tokens from BlockDAG faucet
# Visit: https://testnet.blockdag.network/faucet
```

#### 2. "Network not found"

```bash
# Check your hardhat.config.js
# Ensure BlockDAG testnet is configured correctly
```

#### 3. "Contract not found"

```bash
# Verify the contract address is correct
# Check if deployment was successful
```

#### 4. "MetaMask not found"

- Install MetaMask browser extension
- Ensure the site has permission to access MetaMask

#### 5. "Wrong network"

- Switch to BlockDAG testnet in MetaMask
- The app will prompt to switch networks automatically

## 📊 Expected Gas Costs

| Operation          | Estimated Gas | Cost (BDAG) |
| ------------------ | ------------- | ----------- |
| Deploy Contract    | ~8,000,000    | ~0.008      |
| Upload Document    | ~150,000      | ~0.00015    |
| Grant Permission   | ~80,000       | ~0.00008    |
| Revoke Permission  | ~60,000       | ~0.00006    |
| Transfer Ownership | ~100,000      | ~0.0001     |

## ✅ Success Checklist

- [ ] Contract compiled successfully
- [ ] Tests passed (11/11)
- [ ] Contract deployed to BlockDAG testnet
- [ ] Contract address received
- [ ] Basic interactions tested
- [ ] Frontend integration working
- [ ] MetaMask connection working
- [ ] Document upload working
- [ ] Permission system working
- [ ] Contract verified on explorer

## 🎉 You're Done!

Your BlockDAG document management system is now live and ready for use!

**Next Steps:**

1. Integrate with your existing LegalBox frontend
2. Add more advanced features
3. Deploy to mainnet when ready
4. Monitor contract activity

## 📞 Need Help?

- Check the console for error messages
- Verify your wallet is connected to BlockDAG testnet
- Ensure you have sufficient testnet tokens
- Review the deployment logs for issues

**Happy coding! 🚀**
