// Create IPFS client using project credentials (Infura style) if provided
let createIpfsClient;
try {
  // try to require the real ipfs client; on CI/dev it's expected to be installed
  createIpfsClient = require('ipfs-http-client').create;
} catch (err) {
  // gracefully fallback if the package is not installed so tests that don't use IPFS can run
  createIpfsClient = null;
  console.warn('ipfs-http-client not installed — IPFS functions will throw if used. Install with `npm install ipfs-http-client` to enable IPFS uploads.');
}

const getIpfsClient = () => {
  if (!createIpfsClient) {
    // return a minimal stub that throws when used to give a helpful error later
    return {
      add: async () => { throw new Error('ipfs-http-client not installed. Install it with `npm install ipfs-http-client`.'); }
    };
  }

  if (process.env.IPFS_PROJECT_ID && process.env.IPFS_PROJECT_SECRET) {
    const auth = 'Basic ' + Buffer.from(process.env.IPFS_PROJECT_ID + ':' + process.env.IPFS_PROJECT_SECRET).toString('base64');
    return createIpfsClient({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: { authorization: auth }
    });
  }
  return createIpfsClient();
};

/**
 * Upload buffer to IPFS. Optionally also upload metadata (JSON) and return both CIDs.
 * Returns { cid: <fileCid>, metadataCid?: <metadataCid> }
 */
const uploadBuffer = async (buffer, fileName, metadata) => {
  const client = getIpfsClient();
  const fileRes = await client.add({ content: buffer });
  const result = { cid: fileRes.cid ? fileRes.cid.toString() : String(fileRes) };
  if (metadata) {
    const metaBuf = Buffer.from(JSON.stringify(metadata));
    const metaRes = await client.add({ content: metaBuf });
    result.metadataCid = metaRes.cid ? metaRes.cid.toString() : String(metaRes);
  }
  return result;
};

module.exports = { uploadBuffer, getIpfsClient };
