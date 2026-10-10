const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { loginRateLimiter } = require('../middleware/rateLimiter');

/**
 * Public Authentication Endpoints
 */
router.post('/register', authController.register);
router.post('/login', loginRateLimiter, authController.login);

/**
 * Protected Authentication Endpoints
 * Require valid Bearer token
 */
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
