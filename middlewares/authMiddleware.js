const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'super-secret-jwt-key';

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

    const parts = String(authHeader).split(' ');
    const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : parts[0];

    if (!token) return res.status(401).json({ message: 'Token required' });

    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
