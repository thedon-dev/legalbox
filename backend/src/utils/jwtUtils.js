const jwt = require('jsonwebtoken');

const sign = (payload, opts = {}) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: opts.expiresIn || '7d' });
};

const verify = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { sign, verify };
