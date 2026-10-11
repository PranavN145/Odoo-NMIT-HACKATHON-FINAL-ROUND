const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// PATCH /api/users/me — Authenticated user updates self details
router.patch('/me', authenticate, usersController.updateSelf);

// GET /api/users — Admin lists users
router.get('/', authenticate, authorize('ADMIN'), usersController.listUsers);

// GET /api/users/:id — Admin gets user details
router.get('/:id', authenticate, authorize('ADMIN'), usersController.getUserById);

// PATCH /api/users/:id/role — Admin updates role & volunteer status
router.patch('/:id/role', authenticate, authorize('ADMIN'), usersController.updateUserRole);

module.exports = router;
