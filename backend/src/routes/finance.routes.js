const express = require('express');
const router = express.Router();
const financeController = require('../controllers/finance.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// GET /api/finance/summary — Admin overview of revenues, expenses, balance
router.get('/summary', authenticate, authorize('ADMIN'), financeController.getSummary);

// GET /api/finance/transactions — Admin transaction ledger
router.get('/transactions', authenticate, authorize('ADMIN'), financeController.listTransactions);

// POST /api/finance/transactions — Admin records manual income or expense
router.post('/transactions', authenticate, authorize('ADMIN'), financeController.recordTransaction);

module.exports = router;
