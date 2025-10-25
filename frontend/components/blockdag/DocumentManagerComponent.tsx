// React Component for Document Management with BlockDAG Integration
import React, { useState, useEffect } from "react";
import { useBlockDAGWallet } from "../../hooks/useBlockDAGWallet";
import { Document } from "../../lib/blockdag-wallet";

interface DocumentManagerComponentProps {
  contractAddress: string;
}

export const DocumentManagerComponent: React.FC<
  DocumentManagerComponentProps
> = ({ contractAddress }) => {
  const {
    isConnected,
    account,
    isLoading,
    error,
    connect,
    disconnect,
    uploadDocument,
    grantPermission,
    revokePermission,
    getMyDocuments,
    getSharedDocuments,
    getDocument,
  } = useBlockDAGWallet(contractAddress);

  const [myDocuments, setMyDocuments] = useState<number[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<number[]>([]);
  const [documents, setDocuments] = useState<Map<number, Document>>(new Map());
  const [loading, setLoading] = useState(false);
  const [newDocument, setNewDocument] = useState({
    docHash: "",
    title: "",
    description: "",
  });
  const [shareAddress, setShareAddress] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);

  // Load documents when connected
  useEffect(() => {
    if (isConnected) {
      loadDocuments();
    }
  }, [isConnected]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const [myDocs, sharedDocs] = await Promise.all([
        getMyDocuments(),
        getSharedDocuments(),
      ]);

      setMyDocuments(myDocs);
      setSharedDocuments(sharedDocs);

      // Load document details
      const allDocs = [...myDocs, ...sharedDocs];
      const docMap = new Map<number, Document>();

      for (const docId of allDocs) {
        try {
          const doc = await getDocument(docId);
          docMap.set(docId, doc);
        } catch (err) {
          console.error(`Failed to load document ${docId}:`, err);
        }
      }

      setDocuments(docMap);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocument.docHash || !newDocument.title) return;

    try {
      setLoading(true);
      const result = await uploadDocument(
        newDocument.docHash,
        newDocument.title,
        newDocument.description
      );

      console.log("Document uploaded:", result);
      setNewDocument({ docHash: "", title: "", description: "" });
      await loadDocuments(); // Refresh the list
    } catch (err) {
      console.error("Failed to upload document:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantPermission = async (documentId: number) => {
    if (!shareAddress) return;

    try {
      setLoading(true);
      await grantPermission(documentId, shareAddress);
      setShareAddress("");
      await loadDocuments(); // Refresh the list
    } catch (err) {
      console.error("Failed to grant permission:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokePermission = async (
    documentId: number,
    userAddress: string
  ) => {
    try {
      setLoading(true);
      await revokePermission(documentId, userAddress);
      await loadDocuments(); // Refresh the list
    } catch (err) {
      console.error("Failed to revoke permission:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to manage documents on the BlockDAG network.
          </p>
          <button
            onClick={connect}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </button>
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Document Manager</h1>
            <p className="text-gray-600">Manage your documents on BlockDAG</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Connected as:</p>
            <p className="font-mono text-sm">{account}</p>
            <button
              onClick={disconnect}
              className="text-red-600 hover:text-red-800 text-sm mt-2"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Upload Document Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
        <form onSubmit={handleUploadDocument} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Hash (IPFS Hash)
            </label>
            <input
              type="text"
              value={newDocument.docHash}
              onChange={(e) =>
                setNewDocument({ ...newDocument, docHash: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="QmYourIPFSHash..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={newDocument.title}
              onChange={(e) =>
                setNewDocument({ ...newDocument, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Document title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newDocument.description}
              onChange={(e) =>
                setNewDocument({ ...newDocument, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Document description"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>

      {/* My Documents */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">My Documents</h2>
        {loading ? (
          <p>Loading documents...</p>
        ) : myDocuments.length === 0 ? (
          <p className="text-gray-500">No documents uploaded yet.</p>
        ) : (
          <div className="grid gap-4">
            {myDocuments.map((docId) => {
              const doc = documents.get(docId);
              if (!doc) return null;

              return (
                <div
                  key={docId}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{doc.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {doc.description}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        Hash: {doc.docHash}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded:{" "}
                        {new Date(doc.timestamp * 1000).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          setSelectedDocument(
                            selectedDocument === docId ? null : docId
                          )
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        {selectedDocument === docId ? "Hide" : "Share"}
                      </button>
                    </div>
                  </div>

                  {selectedDocument === docId && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={shareAddress}
                          onChange={(e) => setShareAddress(e.target.value)}
                          placeholder="Enter wallet address to share with"
                          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                        <button
                          onClick={() => handleGrantPermission(docId)}
                          disabled={!shareAddress}
                          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          Grant Access
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shared Documents */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Shared with Me</h2>
        {loading ? (
          <p>Loading shared documents...</p>
        ) : sharedDocuments.length === 0 ? (
          <p className="text-gray-500">No documents shared with you yet.</p>
        ) : (
          <div className="grid gap-4">
            {sharedDocuments.map((docId) => {
              const doc = documents.get(docId);
              if (!doc) return null;

              return (
                <div
                  key={docId}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="font-semibold text-lg">{doc.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {doc.description}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    Hash: {doc.docHash}
                  </p>
                  <p className="text-xs text-gray-500">Owner: {doc.owner}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
