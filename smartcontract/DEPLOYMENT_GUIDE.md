# BlockDAG Smart Contract Deployment Guide

This guide will walk you through deploying the DocumentManager smart contract to the BlockDAG testnet.

## 🎯 Prerequisites

Before starting, ensure you have:

- [ ] Node.js v16+ installed
- [ ] MetaMask or compatible wallet
- [ ] BlockDAG testnet tokens (get from faucet)
- [ ] Private key for deployment account

## 📋 Step-by-Step Deployment

### 1. Environment Setup

```bash
# Navigate to smartcontract directory
cd smartcontract

# Install dependencies
npm install

# Copy environment template
cp env.example .env

# Edit .env file with your configuration
nano .env
```

**Required .env variables:**

```bash
PRIVATE_KEY=your_private_key_here
BLOCKDAG_RPC_URL=https://testnet.blockdag.network
```

### 2. Compile Contracts

```bash
# Compile the smart contracts
npm run compile
```

Expected output:

```
Compiling 1 file with 0.8.19
Compilation finished successfully
```

### 3. Run Tests (Optional but Recommended)

```bash
# Run the test suite
npm test
```

Expected output:

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

### 4. Deploy to BlockDAG Testnet

```bash
# Deploy to BlockDAG testnet
npm run deploy
```

**Expected deployment output:**

```
🚀 Starting DocumentManager deployment...
📝 Deploying contracts with account: 0x1234...
💰 Account balance: 1.5 ETH
📄 Deploying DocumentManager contract...
⏳ Waiting for deployment to be mined...
✅ DocumentManager deployed to: 0xabcd...
🔗 Transaction hash: 0xefgh...
📊 Initial document count: 0

📋 Deployment Summary:
==================================================
Network: blockdag-testnet
Contract Address: 0xabcd...
Deployer: 0x1234...
Transaction Hash: 0xefgh...
Block Number: 12345
Timestamp: 2024-01-01T12:00:00.000Z
==================================================

💾 Deployment info saved to: deployments/blockdag-testnet-1234567890.json
```

### 5. Verify Contract (Optional)

```bash
# Set the deployed contract address
export CONTRACT_ADDRESS=0xabcd...

# Verify the contract
npm run verify
```

## 🔍 Verification Methods

### Method 1: Hardhat Verify

```bash
npx hardhat verify --network blockdag-testnet 0xCONTRACT_ADDRESS
```

### Method 2: BlockDAG Explorer

1. Go to https://testnet.blockdag.network
2. Search for your contract address
3. Click "Verify Contract"
4. Upload the source code and ABI

### Method 3: Manual Verification

1. Copy the contract source code
2. Use the BlockDAG explorer verification tool
3. Paste the source code and constructor arguments

## 🌐 Network Configuration

### BlockDAG Testnet Details

- **Network Name**: BlockDAG Testnet
- **Chain ID**: 26 (0x1a)
- **RPC URL**: https://testnet.blockdag.network
- **Block Explorer**: https://testnet.blockdag.network
- **Currency**: BDAG
- **Symbol**: BDAG
- **Decimals**: 18

### Adding to MetaMask

```javascript
// Add this network to MetaMask
{
  chainId: '0x1a',
  chainName: 'BlockDAG Testnet',
  rpcUrls: ['https://testnet.blockdag.network'],
  blockExplorerUrls: ['https://testnet.blockdag.network'],
  nativeCurrency: {
    name: 'BlockDAG',
    symbol: 'BDAG',
    decimals: 18
  }
}
```

## 🧪 Testing Your Deployment

### 1. Basic Contract Interaction

```javascript
// Connect to the deployed contract
const contract = new ethers.Contract(
  "0xYOUR_CONTRACT_ADDRESS",
  DOCUMENT_MANAGER_ABI,
  signer
);

// Test basic functionality
const totalDocs = await contract.getTotalDocuments();
console.log("Total documents:", totalDocs.toString());
```

### 2. Upload a Test Document

```javascript
// Upload a test document
const tx = await contract.uploadDocument(
  "QmTestHash123",
  "Test Document",
  "This is a test document"
);

const receipt = await tx.wait();
console.log("Document uploaded:", receipt);
```

### 3. Check Document Ownership

```javascript
// Get your documents
const myDocs = await contract.getMyDocuments();
console.log("My documents:", myDocs);

// Get document details
const doc = await contract.getDocument(1);
console.log("Document details:", doc);
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### 1. "Insufficient funds"

```bash
# Check your balance
npx hardhat run scripts/check-balance.js --network blockdag-testnet

# Get testnet tokens from BlockDAG faucet
# Visit: https://testnet.blockdag.network/faucet
```

#### 2. "Network not found"

```bash
# Check network configuration in hardhat.config.js
# Ensure BlockDAG testnet is properly configured
```

#### 3. "Private key not found"

```bash
# Ensure your .env file has the correct private key
# Format: PRIVATE_KEY=0x1234...
```

#### 4. "Gas estimation failed"

```bash
# Increase gas limit in hardhat.config.js
gas: 10000000  // Increase from 8000000
```

### Debug Commands

```bash
# Check network connection
npx hardhat console --network blockdag-testnet

# Verify deployment
npx hardhat verify --network blockdag-testnet 0xCONTRACT_ADDRESS

# Check contract state
npx hardhat run scripts/check-contract.js --network blockdag-testnet
```

## 📊 Deployment Verification Checklist

- [ ] Contract compiled successfully
- [ ] Tests passed
- [ ] Deployment transaction confirmed
- [ ] Contract address received
- [ ] Contract verified on explorer
- [ ] Basic functionality tested
- [ ] Gas costs within budget
- [ ] Network configuration correct

## 🔧 Post-Deployment Setup

### 1. Update Frontend Configuration

```typescript
// Update your frontend .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_ADDRESS
NEXT_PUBLIC_BLOCKDAG_RPC_URL=https://testnet.blockdag.network
```

### 2. Test Frontend Integration

```bash
# Start your frontend
cd ../frontend
npm run dev

# Navigate to the document management page
# Test wallet connection and contract interaction
```

### 3. Monitor Contract Activity

```bash
# Watch for events
npx hardhat run scripts/watch-events.js --network blockdag-testnet
```

## 📝 Deployment Record

Keep a record of your deployment:

```yaml
Deployment Date: 2024-01-01
Network: BlockDAG Testnet
Contract Address: 0x...
Transaction Hash: 0x...
Block Number: 12345
Gas Used: 8000000
Deployer: 0x...
Compiler Version: 0.8.19
Optimization: Enabled (200 runs)
```

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs** - Look for error messages in the deployment output
2. **Verify network** - Ensure you're connected to BlockDAG testnet
3. **Check balance** - Ensure you have sufficient testnet tokens
4. **Review configuration** - Double-check your .env and hardhat.config.js
5. **Test locally** - Try deploying to localhost first

## 🎉 Success!

Once deployed successfully, you should have:

- ✅ Contract deployed to BlockDAG testnet
- ✅ Contract address for frontend integration
- ✅ Verified contract on explorer
- ✅ Working document management system
- ✅ Ready for production use

Your decentralized document management system is now live on BlockDAG! 🚀
