import React, { useState, useEffect } from "react";
import { useBlockchain } from "../../hooks/useBlockchain";

interface BlockchainIntegrationProps {
  userAddress?: string;
}

export const BlockchainIntegration: React.FC<BlockchainIntegrationProps> = ({
  userAddress,
}) => {
  const {
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
  } = useBlockchain();

  const [myDocuments, setMyDocuments] = useState<any[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [newDocument, setNewDocument] = useState({
    docHash: "",
    title: "",
    description: "",
  });
  const [shareAddress, setShareAddress] = useState("");
  const [transferAddress, setTransferAddress] = useState("");

  // Load documents when user address is available
  useEffect(() => {
    if (userAddress && status?.contract.configured) {
      loadDocuments();
    }
  }, [userAddress, status?.contract.configured]);

  const loadDocuments = async () => {
    if (!userAddress) return;

    try {
      setLoading(true);
      const [myDocs, sharedDocs] = await Promise.all([
        getMyDocuments(userAddress),
        getSharedDocuments(userAddress),
      ]);

      setMyDocuments(myDocs);
      setSharedDocuments(sharedDocs);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocument.docHash || !newDocument.title || !userAddress) return;

    try {
      setLoading(true);
      const result = await uploadDocument({
        docHash: newDocument.docHash,
        title: newDocument.title,
        description: newDocument.description,
        ownerAddress: userAddress,
      });

      console.log("Document uploaded to blockchain:", result);
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

  const handleTransferOwnership = async (documentId: number) => {
    if (!transferAddress) return;

    try {
      setLoading(true);
      await transferOwnership(documentId, transferAddress);
      setTransferAddress("");
      await loadDocuments(); // Refresh the list
    } catch (err) {
      console.error("Failed to transfer ownership:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!status?.contract.configured) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <div className="text-yellow-600">⚠️</div>
          <div>
            <h3 className="text-yellow-800 font-semibold">
              Blockchain Not Configured
            </h3>
            <p className="text-yellow-600 text-sm">
              Smart contract is not properly configured. Contact your
              administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!userAddress) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <div className="text-blue-600">ℹ️</div>
          <div>
            <h3 className="text-blue-800 font-semibold">Wallet Required</h3>
            <p className="text-blue-600 text-sm">
              Please connect your wallet to access blockchain features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Document Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Upload Document to Blockchain
        </h2>
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
            disabled={loading || !status.contract.canWrite}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload to Blockchain"}
          </button>
        </form>
      </div>

      {/* My Documents */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">My Blockchain Documents</h2>
        {loading ? (
          <p>Loading documents...</p>
        ) : myDocuments.length === 0 ? (
          <p className="text-gray-500">No documents on blockchain yet.</p>
        ) : (
          <div className="grid gap-4">
            {myDocuments.map((doc) => (
              <div
                key={doc.id}
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
                          selectedDocument === doc.id ? null : doc.id
                        )
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      {selectedDocument === doc.id ? "Hide" : "Manage"}
                    </button>
                  </div>
                </div>

                {selectedDocument === doc.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {/* Grant Permission */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">
                        Grant View Permission
                      </h4>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={shareAddress}
                          onChange={(e) => setShareAddress(e.target.value)}
                          placeholder="Enter wallet address to share with"
                          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                        <button
                          onClick={() => handleGrantPermission(doc.id)}
                          disabled={!shareAddress || !status.contract.canWrite}
                          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          Grant Access
                        </button>
                      </div>
                    </div>

                    {/* Transfer Ownership */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">
                        Transfer Ownership
                      </h4>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={transferAddress}
                          onChange={(e) => setTransferAddress(e.target.value)}
                          placeholder="Enter new owner wallet address"
                          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                        <button
                          onClick={() => handleTransferOwnership(doc.id)}
                          disabled={
                            !transferAddress || !status.contract.canWrite
                          }
                          className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                        >
                          Transfer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
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
            {sharedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-semibold text-lg">{doc.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{doc.description}</p>
                <p className="text-xs text-gray-500 font-mono">
                  Hash: {doc.docHash}
                </p>
                <p className="text-xs text-gray-500">Owner: {doc.owner}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
