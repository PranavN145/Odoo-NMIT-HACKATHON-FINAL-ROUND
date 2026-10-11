const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter for Login Endpoint (POST /api/auth/login)
 * Protects against credential brute-forcing while remaining flexible for hackathon demo use.
 *
 * Configurable via environment variables if desired:
 * - LOGIN_RATE_LIMIT_WINDOW_MS: Window duration in ms (default: 15 minutes)
 * - LOGIN_RATE_LIMIT_MAX: Maximum requests per window (default: 20 attempts)
 */
const windowMs = parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000;
const maxAttempts = parseInt(process.env.LOGIN_RATE_LIMIT_MAX, 10) || 20;

const loginRateLimiter = rateLimit({
  windowMs,
  max: maxAttempts,
  standardHeaders: true, // Return standard RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* legacy headers
  handler: (req, res) => {
    return res.status(429).json({
      status: 'error',
      message: 'Too many login attempts. Please try again later.'
    });
  }
});

module.exports = {
  loginRateLimiter
};
