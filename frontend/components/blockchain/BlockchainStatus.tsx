import React from "react";
import { useBlockchain } from "../../hooks/useBlockchain";

export const BlockchainStatus: React.FC = () => {
  const { status, isLoading, error, refreshStatus } = useBlockchain();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading blockchain status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <div className="text-red-600">❌</div>
          <div>
            <h3 className="text-red-800 font-semibold">
              Blockchain Connection Error
            </h3>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={refreshStatus}
              className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <div className="text-yellow-600">⚠️</div>
          <div>
            <h3 className="text-yellow-800 font-semibold">
              Blockchain Status Unknown
            </h3>
            <p className="text-yellow-600 text-sm">
              Unable to determine blockchain connection status
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Blockchain Status</h2>
        <button
          onClick={refreshStatus}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Network Status */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">Network</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Chain ID:</span>
              <span className="font-mono">{status.network.chainId}</span>
            </div>
            <div className="flex justify-between">
              <span>Name:</span>
              <span>{status.network.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Block:</span>
              <span className="font-mono">
                {status.network.blockNumber.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>RPC:</span>
              <span
                className="font-mono text-xs truncate max-w-32"
                title={status.network.rpcUrl}
              >
                {status.network.rpcUrl}
              </span>
            </div>
          </div>
        </div>

        {/* Contract Status */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">Smart Contract</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Address:</span>
              <span
                className="font-mono text-xs truncate max-w-32"
                title={status.contract.address}
              >
                {status.contract.address}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Configured:</span>
              <span
                className={
                  status.contract.configured ? "text-green-600" : "text-red-600"
                }
              >
                {status.contract.configured ? "✅ Yes" : "❌ No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Write Operations:</span>
              <span
                className={
                  status.contract.canWrite
                    ? "text-green-600"
                    : "text-yellow-600"
                }
              >
                {status.contract.canWrite ? "✅ Enabled" : "⚠️ Read Only"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Documents:</span>
              <span className="font-mono">{status.stats.totalDocuments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-4 flex space-x-4">
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            status.contract.configured
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status.contract.configured ? "Connected" : "Disconnected"}
        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            status.contract.canWrite
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status.contract.canWrite ? "Full Access" : "Read Only"}
        </div>
      </div>
    </div>
  );
};
