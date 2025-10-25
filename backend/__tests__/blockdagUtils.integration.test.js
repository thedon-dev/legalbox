// ensure RPC URL env var is set for tests so config doesn't throw
process.env.BLOCKDAG_RPC_URL = process.env.BLOCKDAG_RPC_URL || 'http://localhost:9999';
const axios = require('axios');
const { recordDocumentOnBlockDAG, fetchDocumentRecord, normalizeRpcResult } = require('../src/utils/blockdagUtils');

jest.mock('axios');

describe('BlockDAG RPC integration (mocked)', () => {
  beforeEach(() => jest.clearAllMocks());

  test('recordDocumentOnBlockDAG normalizes object result', async () => {
    const fakeResult = { txId: 'tx_123', status: 'pending', timestamp: 1690000000 };
    // axios.post should be used inside config/blockdag.rpcRequest; mock a JSON-RPC response
    axios.post.mockResolvedValue({ data: { jsonrpc: '2.0', id: 1, result: fakeResult } });

    const res = await recordDocumentOnBlockDAG('sha256-abc', { ipfsCid: 'bafy...' });
    expect(res).toBeDefined();
    expect(res.txId).toBe('tx_123');
    expect(res.status).toBe('pending');
    expect(res.timestamp).toBe(1690000000);
    expect(res.raw).toEqual(fakeResult);
  });

  test('recordDocumentOnBlockDAG normalizes string result', async () => {
    // Node returns a simple tx id string
    axios.post.mockResolvedValue({ data: { jsonrpc: '2.0', id: 2, result: 'tx_string_456' } });
    const res = await recordDocumentOnBlockDAG('sha256-xyz', {});
    expect(res.txId).toBe('tx_string_456');
    expect(res.status).toBe('unknown');
  });

  test('fetchDocumentRecord normalizes varied response shapes', async () => {
    const varied = { id: 'tx_var_1', confirmation: 'confirmed', time: '2025-01-01T00:00:00Z' };
    axios.post.mockResolvedValue({ data: { jsonrpc: '2.0', id: 3, result: varied } });
    const res = await fetchDocumentRecord('tx_var_1');
    expect(res.txId).toBe('tx_var_1');
    expect(res.status).toBe('confirmed');
    expect(res.timestamp).toBe('2025-01-01T00:00:00Z');
  });

  test('normalizeRpcResult handles null/undefined', () => {
    expect(normalizeRpcResult(null)).toEqual({ txId: null, status: null, timestamp: null, raw: null });
    expect(normalizeRpcResult(undefined)).toEqual({ txId: null, status: null, timestamp: null, raw: undefined });
  });
});
