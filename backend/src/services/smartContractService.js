const { ethers } = require("ethers");

// BlockDAG Network Configuration
const BLOCKDAG_CONFIG = {
  chainId: 26, // BlockDAG testnet chain ID
  chainName: "BlockDAG Testnet",
  rpcUrls: [process.env.BLOCKDAG_RPC_URL || "https://testnet.blockdag.network"],
  blockExplorerUrls: ["https://testnet.blockdag.network"],
  nativeCurrency: {
    name: "BlockDAG",
    symbol: "BDAG",
    decimals: 18,
  },
};

// DocumentManager Contract ABI
const DOCUMENT_MANAGER_ABI = [
  // Events
  "event DocumentUploaded(uint256 indexed documentId, address indexed owner, string docHash, string title)",
  "event DocumentShared(uint256 indexed documentId, address indexed from, address indexed to)",
  "event PermissionRevoked(uint256 indexed documentId, address indexed from, address indexed to)",
  "event OwnershipTransferred(uint256 indexed documentId, address indexed from, address indexed to)",

  // View functions
  "function getMyDocuments() external view returns (uint256[] memory)",
  "function getSharedDocuments() external view returns (uint256[] memory)",
  "function hasPermission(uint256 documentId, address user) external view returns (bool)",
  "function getDocument(uint256 documentId) external view returns (tuple(string docHash, string title, string description, address owner, uint256 timestamp))",
  "function getTotalDocuments() external view returns (uint256)",

  // Write functions
  "function uploadDocument(string memory docHash, string memory title, string memory description) external returns (uint256)",
  "function grantPermission(uint256 documentId, address to) external",
  "function revokePermission(uint256 documentId, address from) external",
  "function transferOwnership(uint256 documentId, address newOwner) external",
];

class SmartContractService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.contractAddress = process.env.BLOCKDAG_CONTRACT_ADDRESS;
    this.privateKey = process.env.BLOCKDAG_PRIVATE_KEY;

    if (!this.contractAddress) {
      console.warn(
        "BLOCKDAG_CONTRACT_ADDRESS not set. Smart contract features will be disabled."
      );
    }

    if (!this.privateKey) {
      console.warn(
        "BLOCKDAG_PRIVATE_KEY not set. Smart contract write operations will be disabled."
      );
    }
  }

  /**
   * Initialize the smart contract service
   */
  async initialize() {
    if (!this.contractAddress) {
      throw new Error("Contract address not configured");
    }

    try {
      // Create provider
      this.provider = new ethers.providers.JsonRpcProvider(
        process.env.BLOCKDAG_RPC_URL || "https://testnet.blockdag.network"
      );

      // Create wallet if private key is available
      let wallet = null;
      if (this.privateKey) {
        wallet = new ethers.Wallet(this.privateKey, this.provider);
      }

      // Create contract instance
      this.contract = new ethers.Contract(
        this.contractAddress,
        DOCUMENT_MANAGER_ABI,
        wallet || this.provider
      );

      console.log("✅ Smart contract service initialized");
      console.log(`📄 Contract address: ${this.contractAddress}`);
      console.log(
        `🔗 RPC URL: ${
          process.env.BLOCKDAG_RPC_URL || "https://testnet.blockdag.network"
        }`
      );

      return true;
    } catch (error) {
      console.error(
        "❌ Failed to initialize smart contract service:",
        error.message
      );
      throw error;
    }
  }

  /**
   * Upload a document to the blockchain
   */
  async uploadDocument(docHash, title, description, ownerAddress) {
    if (!this.contract) {
      throw new Error("Smart contract not initialized");
    }

    try {
      console.log(`📄 Uploading document to blockchain: ${title}`);

      const tx = await this.contract.uploadDocument(
        docHash,
        title,
        description
      );
      const receipt = await tx.wait();

      // Extract document ID from event
      const event = receipt.events?.find((e) => e.event === "DocumentUploaded");
      const documentId = event?.args?.documentId?.toNumber();

      console.log(`✅ Document uploaded successfully!`);
      console.log(`   Document ID: ${documentId}`);
      console.log(`   Transaction: ${tx.hash}`);

      return {
        success: true,
        documentId,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      };
    } catch (error) {
      console.error(
        "❌ Failed to upload document to blockchain:",
        error.message
      );
      throw error;
    }
  }

  /**
   * Grant permission to view a document
   */
  async grantPermission(documentId, toAddress) {
    if (!this.contract) {
      throw new Error("Smart contract not initialized");
    }

    try {
      console.log(
        `🔐 Granting permission for document ${documentId} to ${toAddress}`
      );

      const tx = await this.contract.grantPermission(documentId, toAddress);
      const receipt = await tx.wait();

      console.log(`✅ Permission granted successfully!`);
      console.log(`   Transaction: ${tx.hash}`);

      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      };
    } catch (error) {
      console.error("❌ Failed to grant permission:", error.message);
      throw error;
    }
  }

  /**
   * Revoke permission to view a document
   */
  async revokePermission(documentId, fromAddress) {
    if (!this.contract) {
      throw new Error("Smart contract not initialized");
    }

    try {
      console.log(
        `🚫 Revoking permission for document ${documentId} from ${fromAddress}`
      );

      const tx = await this.contract.revokePermission(documentId, fromAddress);
      const receipt = await tx.wait();

      console.log(`✅ Permission revoked successfully!`);
      console.log(`   Transaction: ${tx.hash}`);

      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      };
    } catch (error) {
      console.error("❌ Failed to revoke permission:", error.message);
      throw error;
    }
  }

  /**
   * Transfer document ownership
   */
  async transferOwnership(documentId, newOwnerAddress) {
    if (!this.contract) {
      throw new Error("Smart contract not initialized");
    }

    try {
      console.log(
        `🔄 Transferring ownership of document ${documentId} to ${newOwnerAddress}`
      );

      const tx = await this.contract.transferOwnership(
        documentId,
        newOwnerAddress
      );
      const receipt = await tx.wait();

      console.log(`✅ Ownership transferred successfully!`);
      console.log(`   Transaction: ${tx.hash}`);

      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      };
    } catch (error) {
      console.error("❌ Failed to transfer ownership:", error.message);
      throw error;
    }
  }

  /**
   * Get documents owned by a user
   */
  async getMyDocuments(userAddress) {
    if (!this.contract) {
      throw new Error("Smart contract not initialized");
    }

    try {
      const documentIds = await this.contract.getMyDocuments();
      return documentIds.map((id) => id.toNumber());
    } catch (error) {
      console.error("❌ Failed to get user documents:", error.message);
      throw error;
    }
  }

  /**
   * Get documents shared with a user
   */
  async getSharedDocuments(userAddress) {
    if (!this.contract) {
      throw new Error("Smart contract not initialized");
    }

    try {
      const documentIds = await this.contract.getSharedDocuments();
      return documentIds.map((id) => id.toNumber());
    } catch (error) {
      console.error("❌ Failed to get shared documents:", error.message);
      throw error;
    }
  }

  /**
   * Check if user has permission for a document
   */
  async hasPermission(documentId, userAddress) {
    if (!this.contract) {
      throw new Error("Smart contract not initialized");
    }

    try {
      return await this.contract.hasPermission(documentId, userAddress);
    } catch (error) {
      console.error("❌ Failed to check permission:", error.message);
      throw error;
    }
  }

  /**
   * Get document details from blockchain
   */
  async getDocument(documentId) {
    if (!this.contract) {
      throw new Error("Smart contract not initialized");
    }

    try {
      const doc = await this.contract.getDocument(documentId);
      return {
        docHash: doc.docHash,
        title: doc.title,
        description: doc.description,
        owner: doc.owner,
        timestamp: doc.timestamp.toNumber(),
      };
    } catch (error) {
      console.error("❌ Failed to get document:", error.message);
      throw error;
    }
  }

  /**
   * Get total number of documents
   */
  async getTotalDocuments() {
    if (!this.contract) {
      throw new Error("Smart contract not initialized");
    }

    try {
      return await this.contract.getTotalDocuments();
    } catch (error) {
      console.error("❌ Failed to get total documents:", error.message);
      throw error;
    }
  }

  /**
   * Get network information
   */
  async getNetworkInfo() {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }

    try {
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();

      return {
        chainId: network.chainId,
        name: network.name,
        blockNumber,
        rpcUrl:
          process.env.BLOCKDAG_RPC_URL || "https://testnet.blockdag.network",
      };
    } catch (error) {
      console.error("❌ Failed to get network info:", error.message);
      throw error;
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured() {
    return !!(this.contractAddress && this.provider);
  }

  /**
   * Check if write operations are available
   */
  canWrite() {
    return !!(this.contractAddress && this.privateKey && this.contract);
  }
}

// Create singleton instance
const smartContractService = new SmartContractService();

module.exports = smartContractService;
