const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// GET /api/tasks/opportunities — Open tasks for volunteers
router.get('/opportunities', authenticate, authorize('VOLUNTEER', 'ADMIN'), tasksController.getOpportunities);

// GET /api/tasks/me — Volunteer's assigned tasks
router.get('/me', authenticate, authorize('VOLUNTEER'), tasksController.getMyTasks);

// GET /api/tasks — Admin lists tasks
router.get('/', authenticate, authorize('ADMIN'), tasksController.listTasks);

// POST /api/tasks — Admin creates task
router.post('/', authenticate, authorize('ADMIN'), tasksController.createTask);

// PATCH /api/tasks/:id/status — Volunteer or Admin updates progress
router.patch('/:id/status', authenticate, tasksController.updateStatus);

// PATCH /api/tasks/:id/assign — Admin assigns/reassigns task
router.patch('/:id/assign', authenticate, authorize('ADMIN'), tasksController.assignTask);

// DELETE /api/tasks/:id — Admin deletes task
router.delete('/:id', authenticate, authorize('ADMIN'), tasksController.deleteTask);

module.exports = router;
