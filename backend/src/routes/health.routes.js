const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint to verify backend server status.
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Student Organization System API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
