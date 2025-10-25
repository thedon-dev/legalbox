jest.mock('../src/models/Document', () => ({
  findOne: jest.fn(async (q) => {
    if (q.hash === 'knownhash') return { _id: 'doc1', hash: 'knownhash', blockdagTxId: 'tx123' };
    return null;
  })
}));

jest.mock('../src/models/Log', () => ({ create: jest.fn(async () => ({ })) }));

jest.mock('../src/utils/blockdagUtils', () => ({
  fetchDocumentRecord: jest.fn(async (txId) => ({ txId, status: 'confirmed', hash: 'knownhash' }))
}));

const { verify } = require('../src/controllers/verifyController');

describe('verifyController.verify', () => {
  it('returns authentic when DB or BlockDAG has the hash', async () => {
    const req = { body: { hash: 'knownhash' }, user: { walletAddress: '0xabc' } };
    const res = { json: jest.fn(), status: jest.fn(() => res) };
    await verify(req, res);
    expect(res.json).toHaveBeenCalled();
    const out = res.json.mock.calls[0][0];
    expect(out.authentic).toBe(true);
    expect(out.document).toBeDefined();
    expect(out.blockdagRecord).toBeDefined();
  });
});
