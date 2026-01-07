const logger = require('../utils/logger');

// In-memory store for rate limiting (use Redis in production clusters)
const requestCounts = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.windowStart > data.windowMs) {
      requestCounts.delete(key);
    }
  }
}, 5 * 60 * 1000);


function createRateLimiter(options = {}) {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100,
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    keyGenerator = (req) => req.ip || req.headers['x-forwarded-for'] || 'unknown',
  } = options;

  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();
    
    let requestData = requestCounts.get(key);
    
    // Initialize or reset window
    if (!requestData || now - requestData.windowStart > windowMs) {
      requestData = {
        count: 0,
        windowStart: now,
        windowMs,
      };
      requestCounts.set(key, requestData);
    }
    
    requestData.count++;
    
    const remaining = Math.max(0, max - requestData.count);
    const resetTime = new Date(requestData.windowStart + windowMs);
    
    res.set({
      'X-RateLimit-Limit': max,
      'X-RateLimit-Remaining': remaining,
      'X-RateLimit-Reset': resetTime.toISOString(),
    });
    
    if (requestData.count > max) {
      logger.warn('Rate limit exceeded', {
        ip: key,
        path: req.path,
        method: req.method,
        count: requestData.count,
      });
      
      res.set('Retry-After', Math.ceil((requestData.windowStart + windowMs - now) / 1000));
      
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((requestData.windowStart + windowMs - now) / 1000),
      });
    }
    
    if (skipSuccessfulRequests) {
      res.on('finish', () => {
        if (res.statusCode < 400) {
          requestData.count--;
        }
      });
    }
    
    next();
  };
}

// Pre-configured rate limiters for common use cases

/**
 * Standard API rate limiter
 * 100 requests per 15 minutes
 */
const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many API requests, please try again later.',
});

/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per 15 minutes
 */
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful logins against the limit
});

/**
 * Rate limiter for sensitive operations (withdrawals, etc.)
 * 10 requests per hour
 */
const sensitiveLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many requests for this operation, please try again later.',
});

module.exports = {
  createRateLimiter,
  apiLimiter,
  authLimiter,
  sensitiveLimiter,
};
