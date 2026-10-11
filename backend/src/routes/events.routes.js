const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events.controller');
const { authenticate, optionalAuthenticate, authorize } = require('../middleware/auth.middleware');

// GET /api/events — Public listing with optional member discount
router.get('/', optionalAuthenticate, eventsController.listEvents);

// GET /api/events/:id — Single event details
router.get('/:id', optionalAuthenticate, eventsController.getEventById);

// POST /api/events — Admin creates event
router.post('/', authenticate, authorize('ADMIN'), eventsController.createEvent);

// PATCH /api/events/:id — Admin updates event
router.patch('/:id', authenticate, authorize('ADMIN'), eventsController.updateEvent);

// DELETE /api/events/:id — Admin deletes event
router.delete('/:id', authenticate, authorize('ADMIN'), eventsController.deleteEvent);

// GET /api/events/:id/attendance — Admin attendance & revenue summary
router.get('/:id/attendance', authenticate, authorize('ADMIN'), eventsController.getAttendance);

// POST /api/events/:id/tickets — Book / reserve event ticket
router.post('/:id/tickets', optionalAuthenticate, eventsController.bookTicket);

module.exports = router;
