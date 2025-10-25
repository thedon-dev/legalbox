const { submitTransaction, getTransaction } = require('../config/blockdag');

/**
 * Normalize various BlockDAG RPC result shapes into a canonical object:
 * { txId, status, timestamp, raw }
 */
const normalizeRpcResult = (result) => {
  if (!result) return { txId: null, status: null, timestamp: null, raw: result };

  // If result is a string, treat it as txId
  if (typeof result === 'string') {
    return { txId: result, status: 'unknown', timestamp: null, raw: result };
  }

  // Common property names mapping
  const txId = result.txId || result.id || result.transactionId || result.hash || null;
  const status = result.status || result.confirmation || result.state || result.confirmed || null;
  const timestamp = result.timestamp || result.time || result.blockTime || result.date || null;

  return { txId, status, timestamp, raw: result };
};

/**
 * Record a document to BlockDAG via RPC and return a canonical result.
 * payload: { hash, metadata }
 * returns { txId, status, timestamp, raw }
 */
const recordDocumentOnBlockDAG = async (hash, metadata = {}) => {
  if (!submitTransaction) throw new Error('BlockDAG RPC not configured');
  const payload = { hash, metadata };
  const res = await submitTransaction(payload);
  return normalizeRpcResult(res);
};

/**
 * Fetch a BlockDAG transaction record by txId via RPC and normalize the response.
 */
const fetchDocumentRecord = async (txId) => {
  if (!getTransaction) throw new Error('BlockDAG RPC not configured');
  const res = await getTransaction(txId);
  return normalizeRpcResult(res);
};

module.exports = { recordDocumentOnBlockDAG, fetchDocumentRecord, normalizeRpcResult };
