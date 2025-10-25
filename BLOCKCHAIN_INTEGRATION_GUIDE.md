# 🔗 LegalBox Blockchain Integration Guide

This guide explains how to integrate the BlockDAG smart contract with your existing LegalBox application.

## 📋 Overview

The blockchain integration is implemented in the **backend** to provide:

- Document ownership registration on-chain
- Permission management between users
- On-chain event logging
- Seamless integration with existing document upload flow

## 🏗️ Architecture

```
Frontend (React/Next.js)
    ↓ API calls
Backend (Node.js/Express)
    ↓ Smart Contract calls
BlockDAG Network
    ↓ Smart Contract
DocumentManager.sol
```

## 🚀 Setup Instructions

### 1. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install ethers@^5.7.2
```

#### Environment Configuration

Copy the environment template:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```bash
# BlockDAG Configuration
BLOCKDAG_RPC_URL=https://testnet.blockdag.network
BLOCKDAG_CONTRACT_ADDRESS=0x...  # Your deployed contract address
BLOCKDAG_PRIVATE_KEY=0x...  # Private key for blockchain transactions
```

#### Deploy Smart Contract

```bash
cd ../smartcontract
npm install
npm run deploy
# Copy the deployed contract address to backend .env
```

### 2. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Environment Configuration

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...  # Your deployed contract address
```

## 🔧 Integration Points

### Backend Integration

#### 1. Smart Contract Service

- **File**: `backend/src/services/smartContractService.js`
- **Purpose**: Handles all blockchain interactions
- **Features**: Document upload, permission management, ownership transfer

#### 2. Blockchain Controller

- **File**: `backend/src/controllers/blockchainController.js`
- **Purpose**: REST API endpoints for blockchain operations
- **Endpoints**:
  - `GET /api/blockchain/status` - Get blockchain status
  - `POST /api/blockchain/documents/upload` - Upload document to blockchain
  - `POST /api/blockchain/documents/:id/grant-permission` - Grant permission
  - `POST /api/blockchain/documents/:id/revoke-permission` - Revoke permission
  - `POST /api/blockchain/documents/:id/transfer-ownership` - Transfer ownership
  - `GET /api/blockchain/documents/my/:address` - Get user's documents
  - `GET /api/blockchain/documents/shared/:address` - Get shared documents

#### 3. Document Controller Integration

- **File**: `backend/src/controllers/documentController.js`
- **Integration**: Automatically uploads documents to blockchain after database save
- **Flow**: File upload → Database save → Blockchain upload → Status update

### Frontend Integration

#### 1. Blockchain API

- **File**: `frontend/lib/api.ts`
- **Purpose**: API client for blockchain operations
- **Usage**: Import `blockchainApi` for blockchain operations

#### 2. Blockchain Hook

- **File**: `frontend/hooks/useBlockchain.ts`
- **Purpose**: React hook for blockchain operations
- **Features**: Status management, document operations, permission management

#### 3. Blockchain Components

- **File**: `frontend/components/blockchain/BlockchainStatus.tsx`
- **File**: `frontend/components/blockchain/BlockchainIntegration.tsx`
- **Purpose**: UI components for blockchain features

## 📱 Usage Examples

### 1. Check Blockchain Status

```typescript
import { useBlockchain } from "../hooks/useBlockchain";

function MyComponent() {
  const { status, isLoading, error } = useBlockchain();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Blockchain Status</h2>
      <p>Network: {status.network.name}</p>
      <p>Contract: {status.contract.address}</p>
      <p>Configured: {status.contract.configured ? "Yes" : "No"}</p>
    </div>
  );
}
```

### 2. Upload Document to Blockchain

```typescript
import { useBlockchain } from "../hooks/useBlockchain";

function UploadComponent() {
  const { uploadDocument } = useBlockchain();

  const handleUpload = async () => {
    try {
      const result = await uploadDocument({
        docHash: "QmYourIPFSHash...",
        title: "My Document",
        description: "Document description",
        ownerAddress: "0x...",
      });
      console.log("Document uploaded:", result);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return <button onClick={handleUpload}>Upload to Blockchain</button>;
}
```

### 3. Manage Document Permissions

```typescript
import { useBlockchain } from "../hooks/useBlockchain";

function PermissionComponent() {
  const { grantPermission, revokePermission } = useBlockchain();

  const handleGrantPermission = async (
    documentId: number,
    toAddress: string
  ) => {
    try {
      await grantPermission(documentId, toAddress);
      console.log("Permission granted");
    } catch (error) {
      console.error("Failed to grant permission:", error);
    }
  };

  const handleRevokePermission = async (
    documentId: number,
    fromAddress: string
  ) => {
    try {
      await revokePermission(documentId, fromAddress);
      console.log("Permission revoked");
    } catch (error) {
      console.error("Failed to revoke permission:", error);
    }
  };

  return (
    <div>
      <button onClick={() => handleGrantPermission(1, "0x...")}>
        Grant Permission
      </button>
      <button onClick={() => handleRevokePermission(1, "0x...")}>
        Revoke Permission
      </button>
    </div>
  );
}
```

## 🔄 Document Upload Flow

### Complete Integration Flow

1. **User uploads file** → Frontend
2. **File sent to backend** → `POST /api/documents/upload`
3. **File processed** → Hash generated, IPFS upload, Cloudinary upload
4. **Database record created** → Document saved to MongoDB
5. **Blockchain upload** → Document uploaded to smart contract
6. **Status updated** → Database record updated with blockchain info
7. **Response sent** → Frontend receives confirmation

### Backend Flow

```javascript
// 1. File upload and processing
const doc = await Document.create({
  name: name || file.originalname,
  description,
  hash,
  ipfsCid,
  cloudUrl: cloud.secure_url,
  ownerWallet,
  isPublic: Boolean(isPublic),
  blockdagStatus: "pending",
});

// 2. Blockchain upload
if (smartContractService.canWrite()) {
  const blockchainResult = await smartContractService.uploadDocument(
    hash,
    doc.name,
    doc.description || "",
    ownerWallet
  );

  // 3. Update database with blockchain info
  doc.blockdagTxId = blockchainResult.transactionHash;
  doc.blockdagStatus = "confirmed";
  doc.blockdagDocumentId = blockchainResult.documentId;
  await doc.save();
}
```

## 🧪 Testing

### 1. Test Backend Integration

```bash
# Start backend
cd backend
npm run dev

# Test blockchain status
curl http://localhost:5000/api/blockchain/status

# Test document upload
curl -X POST http://localhost:5000/api/blockchain/documents/upload \
  -H "Content-Type: application/json" \
  -d '{
    "docHash": "QmTestHash123",
    "title": "Test Document",
    "description": "Test description",
    "ownerAddress": "0x..."
  }'
```

### 2. Test Frontend Integration

```bash
# Start frontend
cd frontend
npm run dev

# Navigate to http://localhost:3000
# Check blockchain status component
# Test document upload and management
```

## 🔍 Monitoring

### Backend Logs

The backend provides detailed logging for blockchain operations:

```
📄 Recording document on BlockDAG smart contract...
✅ Document recorded on blockchain with ID: 1
🔐 Granting permission for document 1 to 0x...
✅ Permission granted successfully!
```

### Frontend Console

The frontend provides error handling and status updates:

```javascript
// Success
console.log("Document uploaded to blockchain:", result);

// Error handling
console.error("Failed to upload document:", error);
```

## 🚨 Troubleshooting

### Common Issues

#### 1. "Smart contract not configured"

- **Cause**: Missing environment variables
- **Solution**: Check `BLOCKDAG_CONTRACT_ADDRESS` and `BLOCKDAG_RPC_URL`

#### 2. "Write operations disabled"

- **Cause**: Missing private key
- **Solution**: Set `BLOCKDAG_PRIVATE_KEY` in environment

#### 3. "Network connection failed"

- **Cause**: Invalid RPC URL or network issues
- **Solution**: Check `BLOCKDAG_RPC_URL` and network connectivity

#### 4. "Contract not found"

- **Cause**: Invalid contract address
- **Solution**: Verify contract deployment and address

### Debug Commands

```bash
# Check backend logs
cd backend
npm run dev

# Check blockchain status
curl http://localhost:5000/api/blockchain/status

# Check contract deployment
cd smartcontract
npm run test-interactions
```

## 📊 Performance Considerations

### Gas Optimization

- Smart contract is optimized for gas efficiency
- Estimated costs:
  - Document upload: ~150,000 gas
  - Permission grant: ~80,000 gas
  - Permission revoke: ~60,000 gas

### Error Handling

- Graceful degradation when blockchain is unavailable
- Automatic retry mechanisms
- Comprehensive error logging

## 🔒 Security Considerations

### Private Key Management

- Private key stored in environment variables
- Never commit private keys to version control
- Use different keys for different environments

### Access Control

- Smart contract enforces permission checks
- Only document owners can grant/revoke permissions
- Ownership transfer requires current owner approval

## 🎉 Success Indicators

### Backend Success

- ✅ Smart contract service initialized
- ✅ Blockchain status endpoint working
- ✅ Document upload to blockchain successful
- ✅ Permission management working

### Frontend Success

- ✅ Blockchain status component showing connected
- ✅ Document upload form working
- ✅ Permission management interface functional
- ✅ Document listing working

## 📞 Support

For issues or questions:

1. Check the logs for error messages
2. Verify environment configuration
3. Test blockchain connectivity
4. Review smart contract deployment

**Your LegalBox application now has full blockchain integration! 🚀**
