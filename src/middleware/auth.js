const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
}

function verifyAdminKey(req, res, next) {
  const apiKey = req.headers['api-key'];

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ message: 'Invalid API key' });
  }

  next();
}

module.exports = { verifyToken, verifyAdminKey };
