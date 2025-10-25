import { useState, useEffect, useCallback } from "react";
import { blockchainApi } from "../lib/api";

interface BlockchainStatus {
  success: boolean;
  network: {
    chainId: number;
    name: string;
    blockNumber: number;
    rpcUrl: string;
  };
  contract: {
    address: string;
    configured: boolean;
    canWrite: boolean;
  };
  stats: {
    totalDocuments: string;
  };
}

interface BlockchainDocument {
  id: number;
  docHash: string;
  title: string;
  description: string;
  owner: string;
  timestamp: number;
}

interface UseBlockchainReturn {
  // Status
  status: BlockchainStatus | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  refreshStatus: () => Promise<void>;
  uploadDocument: (data: {
    docHash: string;
    title: string;
    description: string;
    ownerAddress: string;
  }) => Promise<{ success: boolean; data: any }>;

  grantPermission: (
    documentId: number,
    toAddress: string
  ) => Promise<{ success: boolean; data: any }>;
  revokePermission: (
    documentId: number,
    fromAddress: string
  ) => Promise<{ success: boolean; data: any }>;
  transferOwnership: (
    documentId: number,
    newOwnerAddress: string
  ) => Promise<{ success: boolean; data: any }>;

  // Queries
  getMyDocuments: (userAddress: string) => Promise<BlockchainDocument[]>;
  getSharedDocuments: (userAddress: string) => Promise<BlockchainDocument[]>;
  getDocument: (documentId: number) => Promise<BlockchainDocument>;
  checkPermission: (
    documentId: number,
    userAddress: string
  ) => Promise<boolean>;
}

export function useBlockchain(): UseBlockchainReturn {
  const [status, setStatus] = useState<BlockchainStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load blockchain status on mount
  useEffect(() => {
    refreshStatus();
  }, []);

  const refreshStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await blockchainApi.getStatus();
      setStatus(result);
    } catch (err: any) {
      setError(err.message || "Failed to get blockchain status");
      console.error("Blockchain status error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(
    async (data: {
      docHash: string;
      title: string;
      description: string;
      ownerAddress: string;
    }) => {
      try {
        const result = await blockchainApi.uploadDocument(data);
        return result;
      } catch (err: any) {
        console.error("Upload document error:", err);
        throw err;
      }
    },
    []
  );

  const grantPermission = useCallback(
    async (documentId: number, toAddress: string) => {
      try {
        const result = await blockchainApi.grantPermission(
          documentId,
          toAddress
        );
        return result;
      } catch (err: any) {
        console.error("Grant permission error:", err);
        throw err;
      }
    },
    []
  );

  const revokePermission = useCallback(
    async (documentId: number, fromAddress: string) => {
      try {
        const result = await blockchainApi.revokePermission(
          documentId,
          fromAddress
        );
        return result;
      } catch (err: any) {
        console.error("Revoke permission error:", err);
        throw err;
      }
    },
    []
  );

  const transferOwnership = useCallback(
    async (documentId: number, newOwnerAddress: string) => {
      try {
        const result = await blockchainApi.transferOwnership(
          documentId,
          newOwnerAddress
        );
        return result;
      } catch (err: any) {
        console.error("Transfer ownership error:", err);
        throw err;
      }
    },
    []
  );

  const getMyDocuments = useCallback(
    async (userAddress: string): Promise<BlockchainDocument[]> => {
      try {
        const result = await blockchainApi.getMyDocuments(userAddress);
        return result.documents || [];
      } catch (err: any) {
        console.error("Get my documents error:", err);
        return [];
      }
    },
    []
  );

  const getSharedDocuments = useCallback(
    async (userAddress: string): Promise<BlockchainDocument[]> => {
      try {
        const result = await blockchainApi.getSharedDocuments(userAddress);
        return result.documents || [];
      } catch (err: any) {
        console.error("Get shared documents error:", err);
        return [];
      }
    },
    []
  );

  const getDocument = useCallback(
    async (documentId: number): Promise<BlockchainDocument> => {
      try {
        const result = await blockchainApi.getDocument(documentId);
        return result.document;
      } catch (err: any) {
        console.error("Get document error:", err);
        throw err;
      }
    },
    []
  );

  const checkPermission = useCallback(
    async (documentId: number, userAddress: string): Promise<boolean> => {
      try {
        const result = await blockchainApi.checkPermission(
          documentId,
          userAddress
        );
        return result.hasPermission;
      } catch (err: any) {
        console.error("Check permission error:", err);
        return false;
      }
    },
    []
  );

  return {
    status,
    isLoading,
    error,
    refreshStatus,
    uploadDocument,
    grantPermission,
    revokePermission,
    transferOwnership,
    getMyDocuments,
    getSharedDocuments,
    getDocument,
    checkPermission,
  };
}
