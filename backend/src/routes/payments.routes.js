const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/payments.controller');
const { authenticate } = require('../middleware/auth.middleware');

// POST /api/payments/mock-confirm — Confirms payment and triggers double-entry ledger update
router.post('/mock-confirm', authenticate, paymentsController.mockConfirmPayment);

module.exports = router;
