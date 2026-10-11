const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/tickets.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// GET /api/tickets/me — Authenticated user's tickets
router.get('/me', authenticate, ticketsController.getMyTickets);

// POST /api/tickets/check-in — Volunteer / Admin verifies entry pass
router.post('/check-in', authenticate, authorize('VOLUNTEER', 'ADMIN'), ticketsController.checkInTicket);

// GET /api/tickets/:id — Owner or Admin gets ticket details
router.get('/:id', authenticate, ticketsController.getTicketById);

// PATCH /api/tickets/:id/cancel — Owner or Admin cancels ticket
router.patch('/:id/cancel', authenticate, ticketsController.cancelTicket);

module.exports = router;
