const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// GET /api/dashboard/admin — Admin home consolidated metrics
router.get('/admin', authenticate, authorize('ADMIN'), dashboardController.getAdminDashboard);

// GET /api/dashboard/volunteer — Volunteer duties, check-in access, and reimbursements
router.get('/volunteer', authenticate, authorize('VOLUNTEER'), dashboardController.getVolunteerDashboard);

// GET /api/dashboard/member — Member overview, digital pass, tickets, orders
router.get('/member', authenticate, authorize('MEMBER'), dashboardController.getMemberDashboard);

module.exports = router;
