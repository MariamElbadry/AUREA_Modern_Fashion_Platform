const rateLimit = require('express-rate-limit');

// Rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Allow normal retries while still slowing password guessing
  message: { message: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  // Express uses Vercel's X-Forwarded-For header through `trust proxy`.
  // The additional RFC Forwarded header is intentionally not used.
  validate: { forwardedHeader: false },
});

// Rate limiter for general API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { forwardedHeader: false },
});

module.exports = { authLimiter, apiLimiter };
