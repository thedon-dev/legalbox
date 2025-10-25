const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sign } = require('../utils/jwtUtils');

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, organization, roleType, walletAddress } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User exists' });
  const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
  const user = await User.create({ name, email, organization, roleType, walletAddress, passwordHash });
  const token = sign({ id: user._id, email: user.email });
  res.json({ user, token });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  if (user.passwordHash) {
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = sign({ id: user._id, email: user.email });
  res.json({ user, token });
});

module.exports = { register, login };
