const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  console.log('Auth header received:', auth); // ← debug line

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'suryansh_jobportal_secret_2024'
    );
    req.user = decoded;
    console.log('User from token:', req.user); // ← debug line
    next();
  } catch (err) {
    console.error('Token error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  console.log('User role:', req.user.role, '| Required:', roles); // ← debug
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access forbidden.' });
  }
  next();
};

module.exports = { authenticate, authorize };
