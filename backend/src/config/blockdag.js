const axios = require('axios');

// Use BLOCKDAG_RPC_URL for JSON-RPC endpoint. No API key required for RPC calls.
// Optionally configure RPC method names via env vars:
// BLOCKDAG_RPC_METHOD_SUBMIT (default: 'blockdag_submitData')
// BLOCKDAG_RPC_METHOD_GET (default: 'blockdag_getTransaction')
const BLOCKDAG_RPC_URL = process.env.BLOCKDAG_RPC_URL;
const METHOD_SUBMIT = process.env.BLOCKDAG_RPC_METHOD_SUBMIT || 'blockdag_submitData';
const METHOD_GET = process.env.BLOCKDAG_RPC_METHOD_GET || 'blockdag_getTransaction';

if (!BLOCKDAG_RPC_URL) {
  console.warn('BLOCKDAG_RPC_URL not set. BlockDAG RPC calls will fail until configured.');
}

const rpcRequest = async (method, params = []) => {
  if (!BLOCKDAG_RPC_URL) throw new Error('BLOCKDAG_RPC_URL not configured');
  const body = { jsonrpc: '2.0', id: Date.now(), method, params };
  const res = await axios.post(BLOCKDAG_RPC_URL, body, { headers: { 'Content-Type': 'application/json' } });
  // Follow JSON-RPC 2.0 response shape
  if (res.data && res.data.error) throw new Error(res.data.error.message || 'BlockDAG RPC error');
  return res.data.result;
};

const submitTransaction = async (payload) => {
  // payload is usually an object describing the data to record (e.g. { hash, metadata })
  return rpcRequest(METHOD_SUBMIT, [payload]);
};

const getTransaction = async (txId) => {
  return rpcRequest(METHOD_GET, [txId]);
};

module.exports = { submitTransaction, getTransaction };
