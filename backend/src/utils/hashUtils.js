const fs = require('fs');
const crypto = require('crypto');

const hashBuffer = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

const hashFile = async (filePath) => {
  const buffer = await fs.promises.readFile(filePath);
  return hashBuffer(buffer);
};

module.exports = { hashBuffer, hashFile };
