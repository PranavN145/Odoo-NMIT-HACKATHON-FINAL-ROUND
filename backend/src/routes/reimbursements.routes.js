const express = require('express');
const router = express.Router();
const reimbursementsController = require('../controllers/reimbursements.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// GET /api/reimbursements/me — Member gets own claims
router.get('/me', authenticate, reimbursementsController.getMyClaims);

// POST /api/reimbursements — Member submits claim
router.post('/', authenticate, authorize('MEMBER'), reimbursementsController.submitClaim);

// GET /api/reimbursements — Admin lists claims
router.get('/', authenticate, authorize('ADMIN'), reimbursementsController.listClaims);

// PATCH /api/reimbursements/:id/status — Admin reviews claim status
router.patch('/:id/status', authenticate, authorize('ADMIN'), reimbursementsController.updateStatus);

module.exports = router;
