const express = require('express');
const router = express.Router();
const announcementsController = require('../controllers/announcements.controller');
const { authenticate, optionalAuthenticate, authorize } = require('../middleware/auth.middleware');

// GET /api/announcements — List announcements with role-based filtering
router.get('/', optionalAuthenticate, announcementsController.listAnnouncements);

// GET /api/announcements/:id — Single announcement details
router.get('/:id', optionalAuthenticate, announcementsController.getAnnouncementById);

// POST /api/announcements — Admin creates announcement
router.post('/', authenticate, authorize('ADMIN'), announcementsController.createAnnouncement);

// PATCH /api/announcements/:id — Admin updates announcement
router.patch('/:id', authenticate, authorize('ADMIN'), announcementsController.updateAnnouncement);

// DELETE /api/announcements/:id — Admin deletes announcement
router.delete('/:id', authenticate, authorize('ADMIN'), announcementsController.deleteAnnouncement);

module.exports = router;
