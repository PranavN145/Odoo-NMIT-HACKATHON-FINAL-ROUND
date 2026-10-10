const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const defaultPrisma = require('../lib/prisma');

const BCRYPT_SALT_ROUNDS = 10;
const DEFAULT_JWT_EXPIRES_IN = '24h';

/**
 * Returns configured JWT secret. Throws if missing in production.
 */
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET is not configured in environment variables');
    }
    // Development fallback warning if unset locally
    return 'development_fallback_secret_key_change_in_production';
  }
  return secret;
}

/**
 * Signs a JWT bearer token for the given user.
 * Payload includes id, email, role, and isVolunteer.
 */
function signToken(user) {
  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRES_IN;
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    isVolunteer: Boolean(user.isVolunteer)
  };

  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Sanitizes user record by omitting sensitive password fields.
 */
function sanitizeUser(user, includeDetails = true) {
  if (!user) return null;

  const safe = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVolunteer: Boolean(user.isVolunteer)
  };

  if (includeDetails) {
    safe.phone = user.phone || null;
    safe.createdAt = user.createdAt ? new Date(user.createdAt).toISOString() : undefined;
  }

  return safe;
}

/**
 * Registers a new user account.
 * Public registrations always default to role 'MEMBER' and isVolunteer false.
 */
async function registerUser({ name, email, password, phone }, prismaClient = defaultPrisma) {
  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  try {
    const newUser = await prismaClient.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone: phone || null,
        role: 'MEMBER',
        isVolunteer: false
      }
    });

    const token = signToken(newUser);
    return {
      user: sanitizeUser(newUser, true),
      token
    };
  } catch (err) {
    // Prisma unique constraint violation code is P2002
    if (err && err.code === 'P2002') {
      const error = new Error('Email already in use');
      error.statusCode = 409;
      throw error;
    }
    throw err;
  }
}

/**
 * Authenticates user credentials and returns a token with safe user information.
 */
async function loginUser({ email, password }, prismaClient = defaultPrisma) {
  const user = await prismaClient.user.findUnique({
    where: { email }
  });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken(user);
  return {
    user: sanitizeUser(user, false),
    token
  };
}

/**
 * Retrieves the current authenticated user profile by ID.
 */
async function getCurrentUser(userId, prismaClient = defaultPrisma) {
  const user = await prismaClient.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user, true);
}

module.exports = {
  signToken,
  sanitizeUser,
  registerUser,
  loginUser,
  getCurrentUser
};
