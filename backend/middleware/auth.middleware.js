const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../utils/logger');

function ensureWebToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    logger.warn('Auth attempt without token', { path: req.path, ip: req.ip });
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  // Support both "Bearer <token>" and raw token formats
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;

  jwt.verify(token, config.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      logger.warn('Invalid token attempt', { 
        path: req.path, 
        ip: req.ip,
        error: err.message 
      });
      return res.status(401).json({ 
        success: false, 
        message: err.name === 'TokenExpiredError' 
          ? 'Token has expired' 
          : 'Invalid authentication token' 
      });
    }


    req.user = decoded;
    req.user_id = decoded.id;
    req.email = decoded.email;
    req.address = decoded.address;
    
    return next();
  });
}

/**
 * Middleware to ensure valid JWT token for admin users
 * Verifies both token validity and admin role
 */
function ensureWebTokenForAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    logger.warn('Admin auth attempt without token', { path: req.path, ip: req.ip });
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;

  jwt.verify(token, config.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      logger.warn('Invalid admin token attempt', { 
        path: req.path, 
        ip: req.ip,
        error: err.message 
      });
      return res.status(401).json({ 
        success: false, 
        message: err.name === 'TokenExpiredError' 
          ? 'Token has expired' 
          : 'Invalid authentication token' 
      });
    }

    req.user = decoded;
    
    if (decoded.role !== 'cpadmin') {
      logger.warn('Non-admin attempted admin route', { 
        path: req.path, 
        userId: decoded.id 
      });
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }
    
    return next();
  });
}

module.exports = { ensureWebToken, ensureWebTokenForAdmin };



