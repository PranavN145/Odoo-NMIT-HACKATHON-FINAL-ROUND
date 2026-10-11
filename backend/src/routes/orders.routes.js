const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// GET /api/orders/me — Authenticated user gets orders
router.get('/me', authenticate, ordersController.getMyOrders);

// POST /api/orders — Place merchandise order
router.post('/', authenticate, ordersController.placeOrder);

// GET /api/orders — Admin lists all orders
router.get('/', authenticate, authorize('ADMIN'), ordersController.listOrders);

// GET /api/orders/:id — Owner or Admin gets order details
router.get('/:id', authenticate, ordersController.getOrderById);

// PATCH /api/orders/:id/status — Admin updates status
router.patch('/:id/status', authenticate, authorize('ADMIN'), ordersController.updateStatus);

// PATCH /api/orders/:id/cancel — Owner or Admin cancels order & replenishes stock
router.patch('/:id/cancel', authenticate, ordersController.cancelOrder);

module.exports = router;
