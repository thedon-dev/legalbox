// Sui integration has been deprecated in favor of BlockDAG.
// This module remains as a placeholder to surface a clear error if accidentally required.

const deprecated = () => {
  throw new Error('Sui integration removed. Use BlockDAG via src/utils/blockdagUtils.js');
};

module.exports = { sendDocumentOnChain: deprecated, fetchDocumentOnChain: deprecated };
