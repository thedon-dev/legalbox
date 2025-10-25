const cloudinary = require('../config/cloudinary');

const uploadStream = (buffer, filename, folder = 'documents') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto', folder, public_id: filename }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
};

module.exports = { uploadStream };
