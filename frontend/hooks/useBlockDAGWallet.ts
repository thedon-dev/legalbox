// React Hook for BlockDAG Wallet Integration
import { useState, useEffect, useCallback } from "react";
import { BlockDAGWalletService, Document } from "../lib/blockdag-wallet";

interface UseBlockDAGWalletReturn {
  // Connection state
  isConnected: boolean;
  account: string | null;
  isLoading: boolean;
  error: string | null;

  // Wallet actions
  connect: () => Promise<void>;
  disconnect: () => void;

  // Contract actions
  uploadDocument: (
    docHash: string,
    title: string,
    description: string
  ) => Promise<{ txHash: string; documentId: number }>;
  grantPermission: (documentId: number, to: string) => Promise<string>;
  revokePermission: (documentId: number, from: string) => Promise<string>;
  transferOwnership: (documentId: number, newOwner: string) => Promise<string>;

  // Data fetching
  getMyDocuments: () => Promise<number[]>;
  getSharedDocuments: () => Promise<number[]>;
  hasPermission: (documentId: number, user: string) => Promise<boolean>;
  getDocument: (documentId: number) => Promise<Document>;

  // Event listeners
  onDocumentUploaded: (
    callback: (
      documentId: number,
      owner: string,
      docHash: string,
      title: string
    ) => void
  ) => void;
  onDocumentShared: (
    callback: (documentId: number, from: string, to: string) => void
  ) => void;
  onPermissionRevoked: (
    callback: (documentId: number, from: string, to: string) => void
  ) => void;
}

export function useBlockDAGWallet(
  contractAddress: string
): UseBlockDAGWalletReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletService, setWalletService] =
    useState<BlockDAGWalletService | null>(null);

  // Initialize wallet service
  useEffect(() => {
    if (contractAddress) {
      setWalletService(new BlockDAGWalletService(contractAddress));
    }
  }, [contractAddress]);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0 && walletService) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        } catch (err) {
          console.error("Error checking wallet connection:", err);
        }
      }
    };

    checkConnection();
  }, [walletService]);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAccount(null);
        } else {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  const connect = useCallback(async () => {
    if (!walletService) {
      setError("Wallet service not initialized");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const connectedAccount = await walletService.connectWallet();
      setAccount(connectedAccount);
      setIsConnected(true);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
      console.error("Wallet connection error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [walletService]);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setAccount(null);
    setError(null);
  }, []);

  const uploadDocument = useCallback(
    async (docHash: string, title: string, description: string) => {
      if (!walletService || !isConnected) {
        throw new Error("Wallet not connected");
      }
      return walletService.uploadDocument(docHash, title, description);
    },
    [walletService, isConnected]
  );

  const grantPermission = useCallback(
    async (documentId: number, to: string) => {
      if (!walletService || !isConnected) {
        throw new Error("Wallet not connected");
      }
      return walletService.grantPermission(documentId, to);
    },
    [walletService, isConnected]
  );

  const revokePermission = useCallback(
    async (documentId: number, from: string) => {
      if (!walletService || !isConnected) {
        throw new Error("Wallet not connected");
      }
      return walletService.revokePermission(documentId, from);
    },
    [walletService, isConnected]
  );

  const transferOwnership = useCallback(
    async (documentId: number, newOwner: string) => {
      if (!walletService || !isConnected) {
        throw new Error("Wallet not connected");
      }
      return walletService.transferOwnership(documentId, newOwner);
    },
    [walletService, isConnected]
  );

  const getMyDocuments = useCallback(async () => {
    if (!walletService || !isConnected) {
      throw new Error("Wallet not connected");
    }
    return walletService.getMyDocuments();
  }, [walletService, isConnected]);

  const getSharedDocuments = useCallback(async () => {
    if (!walletService || !isConnected) {
      throw new Error("Wallet not connected");
    }
    return walletService.getSharedDocuments();
  }, [walletService, isConnected]);

  const hasPermission = useCallback(
    async (documentId: number, user: string) => {
      if (!walletService || !isConnected) {
        throw new Error("Wallet not connected");
      }
      return walletService.hasPermission(documentId, user);
    },
    [walletService, isConnected]
  );

  const getDocument = useCallback(
    async (documentId: number) => {
      if (!walletService || !isConnected) {
        throw new Error("Wallet not connected");
      }
      return walletService.getDocument(documentId);
    },
    [walletService, isConnected]
  );

  const onDocumentUploaded = useCallback(
    (
      callback: (
        documentId: number,
        owner: string,
        docHash: string,
        title: string
      ) => void
    ) => {
      if (!walletService || !isConnected) {
        throw new Error("Wallet not connected");
      }
      walletService.onDocumentUploaded(callback);
    },
    [walletService, isConnected]
  );

  const onDocumentShared = useCallback(
    (callback: (documentId: number, from: string, to: string) => void) => {
      if (!walletService || !isConnected) {
        throw new Error("Wallet not connected");
      }
      walletService.onDocumentShared(callback);
    },
    [walletService, isConnected]
  );

  const onPermissionRevoked = useCallback(
    (callback: (documentId: number, from: string, to: string) => void) => {
      if (!walletService || !isConnected) {
        throw new Error("Wallet not connected");
      }
      walletService.onPermissionRevoked(callback);
    },
    [walletService, isConnected]
  );

  return {
    isConnected,
    account,
    isLoading,
    error,
    connect,
    disconnect,
    uploadDocument,
    grantPermission,
    revokePermission,
    transferOwnership,
    getMyDocuments,
    getSharedDocuments,
    hasPermission,
    getDocument,
    onDocumentUploaded,
    onDocumentShared,
    onPermissionRevoked,
  };
}
