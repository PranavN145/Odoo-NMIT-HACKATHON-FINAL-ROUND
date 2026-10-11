const express = require('express');
const router = express.Router();
const { prisma, memoryUsers } = require('../lib/db');
const { sendVerificationEmail, verifyCode, pendingVerifications } = require('../lib/email');

/**
 * POST /api/auth/register
 * Validates details and dispatches a verification email.
 */
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Name, email, and password are required fields.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists in memoryUsers
    const existingMemoryUser = memoryUsers.find(
      u => u.email.toLowerCase() === normalizedEmail
    );

    if (existingMemoryUser) {
      return res.status(409).json({
        error: 'User exists',
        message: 'An account with this email address already exists.'
      });
    }

    if (prisma) {
      try {
        const existingDbUser = await prisma.user.findUnique({
          where: { email: normalizedEmail }
        });

        if (existingDbUser) {
          return res.status(409).json({
            error: 'User exists',
            message: 'An account with this email address already exists.'
          });
        }
      } catch (dbErr) {
        // Fallback to memory
      }
    }

    // Send verification email with 6-digit code
    const mailResult = await sendVerificationEmail({ name, email, password });

    return res.status(200).json({
      success: true,
      verificationRequired: true,
      message: `A 6-digit verification code has been dispatched to ${normalizedEmail}.`,
      email: normalizedEmail,
      demoCode: mailResult.code,
      previewUrl: mailResult.previewUrl
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/verify
 * Validates the 6-digit verification code and activates the new account.
 */
router.post('/verify', async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Email and verification code are required.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const result = verifyCode(normalizedEmail, code);

    if (!result.valid) {
      return res.status(400).json({
        error: 'Verification failed',
        message: result.reason
      });
    }

    const { name, password } = result.userPayload;
    let newUser = null;

    if (prisma) {
      try {
        const dbUser = await prisma.user.create({
          data: {
            name: name.trim(),
            email: normalizedEmail,
            passwordHash: password,
            role: 'MEMBER'
          }
        });

        newUser = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: 'USER',
          createdAt: dbUser.createdAt.toISOString()
        };
      } catch (dbErr) {
        console.warn('Prisma user creation fallback to memory store:', dbErr.message);
      }
    }

    if (!newUser) {
      newUser = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password: password,
        role: 'USER',
        createdAt: new Date().toISOString()
      };
    }

    // Always ensure the user exists in memoryUsers for immediate login support
    const existingIndex = memoryUsers.findIndex(u => u.email.toLowerCase() === normalizedEmail);
    const userToStore = {
      id: newUser.id,
      name: newUser.name,
      email: normalizedEmail,
      password: password,
      role: 'USER',
      createdAt: newUser.createdAt || new Date().toISOString()
    };

    if (existingIndex >= 0) {
      memoryUsers[existingIndex] = userToStore;
    } else {
      memoryUsers.push(userToStore);
    }

    return res.status(201).json({
      success: true,
      message: 'Email verified successfully! Account created.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/resend-code
 * Resends verification email.
 */
router.post('/resend-code', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const pending = pendingVerifications.get(normalizedEmail);

    if (!pending) {
      return res.status(404).json({
        error: 'Not found',
        message: 'No pending registration found for this email address. Please sign up again.'
      });
    }

    const mailResult = await sendVerificationEmail({
      name: pending.name,
      email: pending.email,
      password: pending.password
    });

    return res.status(200).json({
      success: true,
      message: `A new verification code has been dispatched to ${normalizedEmail}.`,
      demoCode: mailResult.code,
      previewUrl: mailResult.previewUrl
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Validates user credentials by email or user ID.
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Email ID and password are required.'
      });
    }

    const normalizedIdentifier = email.trim().toLowerCase();

    // Find in memory store by email or id
    const memoryUser = memoryUsers.find(
      u => (u.email.toLowerCase() === normalizedIdentifier || 
            (u.id && u.id.toLowerCase() === normalizedIdentifier)) && 
            u.password === password
    );

    if (memoryUser) {
      return res.status(200).json({
        success: true,
        user: {
          id: memoryUser.id,
          name: memoryUser.name,
          email: memoryUser.email,
          role: memoryUser.role
        }
      });
    }

    // Try database if available
    if (prisma) {
      try {
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: normalizedIdentifier },
              { id: normalizedIdentifier }
            ]
          }
        });

        if (dbUser && dbUser.passwordHash === password) {
          return res.status(200).json({
            success: true,
            user: {
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              role: dbUser.role === 'ADMIN' ? 'ADMIN' : 'USER'
            }
          });
        }
      } catch (dbErr) {
        console.warn('Prisma login check fallback:', dbErr.message);
      }
    }

    return res.status(401).json({
      error: 'Invalid credentials',
      message: 'Incorrect email or password.'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/users
 * Returns list of registered users.
 */
router.get('/users', (req, res) => {
  const users = memoryUsers.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt
  }));
  res.status(200).json({ users });
});

module.exports = router;
