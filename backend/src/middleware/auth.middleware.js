const jwt = require('jsonwebtoken');
const defaultPrisma = require('../lib/prisma');
const { sanitizeUser, getJwtSecret } = require('../services/auth.service');

/**
 * Authentication Middleware
 * Validates Authorization: Bearer <token> and attaches the verified user to req.user.
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication token is missing or malformed'
    });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication token is empty'
    });
  }

  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token payload'
      });
    }

    // Retrieve fresh user record from database
    const prisma = req.app?.get('prisma') || defaultPrisma;
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });
    } catch (dbErr) {
      // If database is not reachable or unavailable
      return res.status(503).json({
        status: 'error',
        message: 'Database service unavailable'
      });
    }

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User belonging to this token no longer exists'
      });
    }

    req.user = sanitizeUser(user, true);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token has expired'
      });
    }

    return res.status(401).json({
      status: 'error',
      message: 'Invalid authentication token'
    });
  }
};

/**
 * Role / Permission Authorization Middleware
 *
 * Supported roles in contract:
 * - 'PUBLIC': Unauthenticated or any caller
 * - 'MEMBER': Authenticated user with role === 'MEMBER'
 * - 'VOLUNTEER': Authenticated member with role === 'MEMBER' and isVolunteer === true
 * - 'ADMIN': Authenticated user with role === 'ADMIN'
 *
 * Rule: Admins do NOT automatically qualify as volunteers.
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // If route allows PUBLIC access, permit without credentials
    if (allowedRoles.includes('PUBLIC')) {
      return next();
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const isMember = user.role === 'MEMBER';
    const isAdmin = user.role === 'ADMIN';
    const isVolunteer = isMember && Boolean(user.isVolunteer);

    const hasPermission = allowedRoles.some((role) => {
      if (role === 'ADMIN') return isAdmin;
      if (role === 'VOLUNTEER') return isVolunteer;
      if (role === 'MEMBER') return isMember;
      return false;
    });

    if (!hasPermission) {
      return res.status(403).json({
        status: 'error',
        message: 'Access forbidden: insufficient permissions'
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
