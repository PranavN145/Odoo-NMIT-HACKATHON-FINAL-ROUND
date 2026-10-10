const authService = require('../services/auth.service');
const { validateRegister, validateLogin } = require('../validators/auth.validator');
const defaultPrisma = require('../lib/prisma');

/**
 * Helper to obtain prisma instance (supports dependency injection for testing)
 */
function getPrisma(req) {
  return req.app?.get('prisma') || defaultPrisma;
}

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const validation = validateRegister(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        status: 'error',
        message: validation.error
      });
    }

    const prisma = getPrisma(req);
    const result = await authService.registerUser(validation.value, prisma);

    return res.status(201).json({
      status: 'ok',
      message: 'User registered successfully',
      data: result
    });
  } catch (err) {
    if (err.statusCode === 409) {
      return res.status(409).json({
        status: 'error',
        message: err.message
      });
    }

    // Handle database connection issues gracefully
    if (err.code === 'P1001' || err.message?.includes('connect') || err.message?.includes('timeout')) {
      return res.status(503).json({
        status: 'error',
        message: 'Database service unavailable. Please verify PostgreSQL connection.'
      });
    }

    next(err);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const validation = validateLogin(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        status: 'error',
        message: validation.error
      });
    }

    const prisma = getPrisma(req);
    const result = await authService.loginUser(validation.value, prisma);

    return res.status(200).json({
      status: 'ok',
      message: 'Login successful',
      data: result
    });
  } catch (err) {
    if (err.statusCode === 401) {
      return res.status(401).json({
        status: 'error',
        message: err.message
      });
    }

    if (err.code === 'P1001' || err.message?.includes('connect') || err.message?.includes('timeout')) {
      return res.status(503).json({
        status: 'error',
        message: 'Database service unavailable. Please verify PostgreSQL connection.'
      });
    }

    next(err);
  }
}

/**
 * POST /api/auth/logout
 */
async function logout(req, res) {
  // Stateless JWT: The client is instructed to discard the Bearer token.
  return res.status(200).json({
    status: 'ok',
    message: 'Logged out successfully'
  });
}

/**
 * GET /api/auth/me
 */
async function getMe(req, res) {
  return res.status(200).json({
    status: 'ok',
    data: req.user
  });
}

module.exports = {
  register,
  login,
  logout,
  getMe
};
