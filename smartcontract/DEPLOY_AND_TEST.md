# 🚀 BlockDAG Smart Contract - Deploy & Test Guide

Complete guide for deploying the DocumentManager smart contract to BlockDAG testnet and testing all interactions.

## 📋 Prerequisites

Before starting, ensure you have:

- [ ] **Node.js v16+** installed
- [ ] **MetaMask** or compatible wallet
- [ ] **BlockDAG testnet tokens** (get from [faucet](https://testnet.blockdag.network/faucet))
- [ ] **Private key** for deployment account

## ⚡ Quick Start (10 minutes)

### 1. Setup Environment

```bash
# Navigate to smartcontract directory
cd smartcontract

# Install dependencies
npm install

# Configure environment
cp env.example .env
nano .env  # Add your private key
```

**Required .env content:**

```bash
PRIVATE_KEY=0x1234567890abcdef...  # Your wallet private key
BLOCKDAG_RPC_URL=https://testnet.blockdag.network
```

### 2. Compile & Test

```bash
# Compile contracts
npm run compile

# Run unit tests
npm test
```

**Expected output:**

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

### 3. Check Account Balance

```bash
# Check if you have enough testnet tokens
npm run check-balance
```

**Expected output:**

```
💰 Checking Account Balances on BlockDAG Testnet
==================================================
👥 Account Balances:
------------------------------
Deployer  :              1.5 BDAG
User1     :              1.0 BDAG
User2     :              1.0 BDAG
User3     :              1.0 BDAG
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

### Run Comprehensive Tests

```bash
# Test all contract interactions
CONTRACT_ADDRESS=0xabcd1234567890... npm run test-interactions
```

**Expected test output:**

```
🧪 Testing DocumentManager Contract Interactions...
============================================================
👥 Test Accounts:
  Deployer: 0x1234...
  User1: 0x5678...
  User2: 0x9abc...
  User3: 0xdef0...

📄 Contract Address: 0xabcd1234567890...

🔍 Test 1: Initial State Check
----------------------------------------
✅ Total documents: 0

📄 Test 2: Document Upload
----------------------------------------
⏳ Uploading document... TX: 0x...
✅ Document uploaded successfully!
   Document ID: 1
   Owner: 0x5678...
   Title: Test Document 1

🔍 Test 3: Document Details
----------------------------------------
✅ Document details retrieved:
   Title: Test Document 1
   Description: This is the first test document for BlockDAG integration
   Owner: 0x5678...
   Hash: QmTestHash123
   Timestamp: 1/1/2024, 12:00:00 PM

📄 Test 4: Second Document Upload
----------------------------------------
✅ Second document uploaded!
   Document ID: 2

📚 Test 5: User Documents
----------------------------------------
✅ User1's documents: [1, 2]

🔐 Test 6: Permission Management
----------------------------------------
⏳ Granting permission to user2...
✅ Permission granted!
   From: 0x5678...
   To: 0x9abc...
   Document ID: 1

✅ Test 7: Permission Verification
----------------------------------------
✅ User2 has permission for document 1: true

📖 Test 8: Shared Documents
----------------------------------------
✅ Documents shared with user2: [1]

🔍 Test 9: Access Shared Document
----------------------------------------
✅ User2 can access shared document:
   Title: Test Document 1
   Owner: 0x5678...

🔐 Test 10: Grant Permission to User3
----------------------------------------
✅ Permission granted to user3 for document 2

✅ Test 11: Check User3's Shared Documents
----------------------------------------
✅ Documents shared with user3: [2]

🚫 Test 12: Revoke Permission
----------------------------------------
⏳ Revoking permission from user2...
✅ Permission revoked!
   From: 0x5678...
   To: 0x9abc...
   Document ID: 1

✅ Test 13: Verify Permission is Revoked
----------------------------------------
✅ User2 permission after revoke: false

🔄 Test 14: Ownership Transfer
----------------------------------------
⏳ Transferring ownership to user2...
✅ Ownership transferred!
   From: 0x5678...
   To: 0x9abc...
   Document ID: 2

✅ Test 15: Verify New Owner
----------------------------------------
✅ New owner: 0x9abc...

✅ Test 16: Check User2's Documents After Transfer
----------------------------------------
✅ User2's documents after transfer: [2]

📊 Test 17: Final State
----------------------------------------
✅ Final total documents: 2

🎉 ALL TESTS COMPLETED SUCCESSFULLY!
============================================================
📋 Test Summary:
  ✅ Document upload: PASSED
  ✅ Document retrieval: PASSED
  ✅ Permission granting: PASSED
  ✅ Permission verification: PASSED
  ✅ Shared documents: PASSED
  ✅ Permission revocation: PASSED
  ✅ Ownership transfer: PASSED
  ✅ Access control: PASSED

🚀 Your BlockDAG Document Manager is working perfectly!
```

## 🌐 Frontend Integration Test

### 1. Create Test HTML Page

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
    <div id="status">Not connected</div>
    <button id="connect">Connect Wallet</button>
    <button id="upload">Upload Test Document</button>
    <button id="list">List My Documents</button>
    <div id="results"></div>

    <script>
        const CONTRACT_ADDRESS = "0xabcd1234567890..."; // Replace with your deployed address
        const CONTRACT_ABI = [
            "function uploadDocument(string memory docHash, string memory title, string memory description) external returns (uint256)",
            "function getMyDocuments() external view returns (uint256[] memory)",
            "function getDocument(uint256 documentId) external view returns (tuple(string docHash, string title, string description, address owner, uint256 timestamp))",
            "function grantPermission(uint256 documentId, address to) external",
            "function getSharedDocuments() external view returns (uint256[] memory)",
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

        document.getElementById('list').onclick = async () => {
            if (!contract) {
                document.getElementById('results').innerHTML = 'Please connect wallet first!';
                return;
            }

            try {
                const myDocs = await contract.getMyDocuments();
                let html = '<h3>My Documents:</h3>';

                for (const docId of myDocs) {
                    const doc = await contract.getDocument(docId);
                    html += `
                        <div style="border: 1px solid #ccc; margin: 10px; padding: 10px;">
                            <strong>ID:</strong> ${docId}<br>
                            <strong>Title:</strong> ${doc.title}<br>
                            <strong>Description:</strong> ${doc.description}<br>
                            <strong>Owner:</strong> ${doc.owner}<br>
                            <strong>Hash:</strong> ${doc.docHash}
                        </div>
                    `;
                }

                document.getElementById('results').innerHTML = html;
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

### 2. Test Frontend Integration

1. Open `test-frontend.html` in your browser
2. Click "Connect Wallet" and approve MetaMask
3. Click "Upload Test Document" to test document upload
4. Click "List My Documents" to see your documents

## 🔍 Verify Deployment

### 1. Check on BlockDAG Explorer

1. Go to [BlockDAG Testnet Explorer](https://testnet.blockdag.network)
2. Search for your contract address
3. Verify the contract is deployed and has the correct code

### 2. Verify Contract Code (Optional)

```bash
# Verify contract source code
npx hardhat verify --network blockdag-testnet 0xYOUR_CONTRACT_ADDRESS
```

## 📊 Expected Gas Costs

| Operation          | Estimated Gas | Cost (BDAG) |
| ------------------ | ------------- | ----------- |
| Deploy Contract    | ~8,000,000    | ~0.008      |
| Upload Document    | ~150,000      | ~0.00015    |
| Grant Permission   | ~80,000       | ~0.00008    |
| Revoke Permission  | ~60,000       | ~0.00006    |
| Transfer Ownership | ~100,000      | ~0.0001     |

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. "Insufficient funds"

```bash
# Check your balance
npm run check-balance

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
