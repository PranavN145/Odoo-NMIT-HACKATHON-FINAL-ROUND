const express = require('express');
const router = express.Router();
const membershipsController = require('../controllers/memberships.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// GET /api/memberships/me — Authenticated member gets active/latest membership
router.get('/me', authenticate, membershipsController.getMyMembership);

// POST /api/memberships — Member applies for / renews membership
router.post('/', authenticate, authorize('MEMBER'), membershipsController.applyMembership);

// GET /api/memberships/expiring — Admin oversight for renewals
router.get('/expiring', authenticate, authorize('ADMIN'), membershipsController.listExpiring);

// GET /api/memberships — Admin lists all memberships
router.get('/', authenticate, authorize('ADMIN'), membershipsController.listMemberships);

// GET /api/memberships/:id — Admin gets single membership
router.get('/:id', authenticate, authorize('ADMIN'), membershipsController.getMembershipById);

// PATCH /api/memberships/:id/status — Admin reviews and activates/rejects membership
router.patch('/:id/status', authenticate, authorize('ADMIN'), membershipsController.updateStatus);

module.exports = router;
