const { uploadDocument } = require('../src/controllers/documentController');

jest.mock('../src/utils/ipfsUtils', () => ({
  uploadBuffer: jest.fn(async (buf) => ({ cid: 'bafytestcid', metadataCid: 'bafymeta' })),
  getIpfsClient: jest.fn()
}));

jest.mock('../src/utils/cloudinaryUpload', () => ({
  uploadStream: jest.fn(async (buffer, filename) => ({ secure_url: `https://cloudinary.test/${filename}` }))
}));

jest.mock('../src/utils/blockdagUtils', () => ({
  recordDocumentOnBlockDAG: jest.fn(async (hash, metadata) => ({ txId: 'blockdag_tx_123', status: 'confirmed' })),
  fetchDocumentRecord: jest.fn()
}));

jest.mock('../src/utils/emailUtils', () => ({ sendNotification: jest.fn(async () => {}) }));

// Mock Mongoose models used in controller
jest.mock('../src/models/Document', () => ({
  create: jest.fn(async (data) => ({
    _id: 'doc1',
    ...data,
    save: async function () { return this; }
  })),
  find: jest.fn()
}));

jest.mock('../src/models/Log', () => ({ create: jest.fn(async () => ({ })) }));

describe('documentController.uploadDocument', () => {
  it('should process upload, save Document and record on BlockDAG', async () => {
    // handler is an array [multerMiddleware, handler]
    const handler = uploadDocument[1];

    const mockReq = {
      file: { buffer: Buffer.from('testfile'), originalname: 'test.pdf', size: 8 },
      body: { name: 'Test Doc', description: 'desc', isPublic: 'true' },
      user: { walletAddress: '0xabc', email: 'owner@test.com' }
    };

    const res = {
      json: jest.fn()
    };

    await handler(mockReq, res);

    expect(res.json).toHaveBeenCalled();
    const resp = res.json.mock.calls[0][0];
    expect(resp.doc).toBeDefined();
    expect(resp.doc.hash).toBeDefined();
    expect(resp.doc.blockdagTxId).toBe('blockdag_tx_123');
  });
});
