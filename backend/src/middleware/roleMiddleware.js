const roleMiddleware = (roles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (typeof roles === 'string') roles = [roles];
  if (roles.length && !roles.includes(req.user.roleType)) {
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  }
  next();
};

module.exports = roleMiddleware;
