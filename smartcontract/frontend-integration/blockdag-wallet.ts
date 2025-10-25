// BlockDAG Wallet Integration for React/Next.js
// This file provides utilities for connecting to BlockDAG network and interacting with the DocumentManager contract

import { ethers } from "ethers";

// BlockDAG Network Configuration
export const BLOCKDAG_CONFIG = {
  chainId: 26, // BlockDAG testnet chain ID
  chainName: "BlockDAG Testnet",
  rpcUrls: ["https://testnet.blockdag.network"],
  blockExplorerUrls: ["https://testnet.blockdag.network"],
  nativeCurrency: {
    name: "BlockDAG",
    symbol: "BDAG",
    decimals: 18,
  },
};

// DocumentManager Contract ABI (minimal for frontend)
export const DOCUMENT_MANAGER_ABI = [
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

export interface Document {
  docHash: string;
  title: string;
  description: string;
  owner: string;
  timestamp: number;
}

export interface DocumentManagerContract {
  uploadDocument: (
    docHash: string,
    title: string,
    description: string
  ) => Promise<ethers.ContractTransaction>;
  grantPermission: (
    documentId: number,
    to: string
  ) => Promise<ethers.ContractTransaction>;
  revokePermission: (
    documentId: number,
    from: string
  ) => Promise<ethers.ContractTransaction>;
  transferOwnership: (
    documentId: number,
    newOwner: string
  ) => Promise<ethers.ContractTransaction>;
  getMyDocuments: () => Promise<number[]>;
  getSharedDocuments: () => Promise<number[]>;
  hasPermission: (documentId: number, user: string) => Promise<boolean>;
  getDocument: (documentId: number) => Promise<Document>;
  getTotalDocuments: () => Promise<number>;
}

export class BlockDAGWalletService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;
  private contractAddress: string;

  constructor(contractAddress: string) {
    this.contractAddress = contractAddress;
  }

  /**
   * Connect to BlockDAG network using MetaMask or compatible wallet
   */
  async connectWallet(): Promise<string> {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask or compatible wallet not found");
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length === 0) {
      throw new Error("No accounts found");
    }

    // Create provider and signer
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();

    // Check if we're on the correct network
    const network = await this.provider.getNetwork();
    if (network.chainId !== BLOCKDAG_CONFIG.chainId) {
      await this.switchToBlockDAGNetwork();
    }

    // Initialize contract
    this.contract = new ethers.Contract(
      this.contractAddress,
      DOCUMENT_MANAGER_ABI,
      this.signer
    );

    return accounts[0];
  }

  /**
   * Switch to BlockDAG network
   */
  async switchToBlockDAGNetwork(): Promise<void> {
    if (!window.ethereum) {
      throw new Error("MetaMask not found");
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${BLOCKDAG_CONFIG.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [BLOCKDAG_CONFIG],
        });
      } else {
        throw switchError;
      }
    }
  }

  /**
   * Get the connected account address
   */
  async getAccount(): Promise<string> {
    if (!this.signer) {
      throw new Error("Wallet not connected");
    }
    return await this.signer.getAddress();
  }

  /**
   * Get contract instance
   */
  getContract(): ethers.Contract {
    if (!this.contract) {
      throw new Error("Contract not initialized. Please connect wallet first.");
    }
    return this.contract;
  }

  /**
   * Upload a document to the blockchain
   */
  async uploadDocument(
    docHash: string,
    title: string,
    description: string
  ): Promise<{ txHash: string; documentId: number }> {
    const contract = this.getContract();

    const tx = await contract.uploadDocument(docHash, title, description);
    const receipt = await tx.wait();

    // Extract document ID from event
    const event = receipt.events?.find(
      (e: any) => e.event === "DocumentUploaded"
    );
    const documentId = event?.args?.documentId?.toNumber();

    return {
      txHash: tx.hash,
      documentId: documentId || 0,
    };
  }

  /**
   * Grant permission to view a document
   */
  async grantPermission(documentId: number, to: string): Promise<string> {
    const contract = this.getContract();
    const tx = await contract.grantPermission(documentId, to);
    await tx.wait();
    return tx.hash;
  }

  /**
   * Revoke permission to view a document
   */
  async revokePermission(documentId: number, from: string): Promise<string> {
    const contract = this.getContract();
    const tx = await contract.revokePermission(documentId, from);
    await tx.wait();
    return tx.hash;
  }

  /**
   * Transfer document ownership
   */
  async transferOwnership(
    documentId: number,
    newOwner: string
  ): Promise<string> {
    const contract = this.getContract();
    const tx = await contract.transferOwnership(documentId, newOwner);
    await tx.wait();
    return tx.hash;
  }

  /**
   * Get user's documents
   */
  async getMyDocuments(): Promise<number[]> {
    const contract = this.getContract();
    const documentIds = await contract.getMyDocuments();
    return documentIds.map((id: any) => id.toNumber());
  }

  /**
   * Get documents shared with user
   */
  async getSharedDocuments(): Promise<number[]> {
    const contract = this.getContract();
    const documentIds = await contract.getSharedDocuments();
    return documentIds.map((id: any) => id.toNumber());
  }

  /**
   * Check if user has permission for a document
   */
  async hasPermission(documentId: number, user: string): Promise<boolean> {
    const contract = this.getContract();
    return await contract.hasPermission(documentId, user);
  }

  /**
   * Get document details
   */
  async getDocument(documentId: number): Promise<Document> {
    const contract = this.getContract();
    const doc = await contract.getDocument(documentId);
    return {
      docHash: doc.docHash,
      title: doc.title,
      description: doc.description,
      owner: doc.owner,
      timestamp: doc.timestamp.toNumber(),
    };
  }

  /**
   * Listen to contract events
   */
  onDocumentUploaded(
    callback: (
      documentId: number,
      owner: string,
      docHash: string,
      title: string
    ) => void
  ) {
    const contract = this.getContract();
    contract.on("DocumentUploaded", (documentId, owner, docHash, title) => {
      callback(documentId.toNumber(), owner, docHash, title);
    });
  }

  onDocumentShared(
    callback: (documentId: number, from: string, to: string) => void
  ) {
    const contract = this.getContract();
    contract.on("DocumentShared", (documentId, from, to) => {
      callback(documentId.toNumber(), from, to);
    });
  }

  onPermissionRevoked(
    callback: (documentId: number, from: string, to: string) => void
  ) {
    const contract = this.getContract();
    contract.on("PermissionRevoked", (documentId, from, to) => {
      callback(documentId.toNumber(), from, to);
    });
  }
}

// Global type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
