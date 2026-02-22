module.exports = {
  secret: process.env.JWT_SECRET || 'fallback-secret',
  expiresIn: '7d'
};
