// Sui utilities removed — use BlockDAG utils instead.
const deprecated = () => {
  throw new Error('Sui utilities removed. Use src/utils/blockdagUtils.js for DAG integration.');
};

module.exports = { recordDocument: deprecated, getDocumentOnChain: deprecated };
