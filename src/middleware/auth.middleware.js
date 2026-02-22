const jwt = require('jsonwebtoken')
const {secret} = require('../config/auth.config')

//req - объект запроса (что прислал клиент)
//res - объект ответа (что мы отправим клиенту)
//next - функция, которая передает управление дальше
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({error: 'No token provided'})
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, secret)
    req.userId = decoded.id
    req.userEmail = decoded.email
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({error: 'Token expired'})
    }

    return res.status(403).json({error: 'Invalid token'})
  }
}

module.exports = authMiddleware
