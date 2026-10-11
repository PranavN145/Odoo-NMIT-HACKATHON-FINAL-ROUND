require('dotenv').config();
const { assertJwtSecretConfigured } = require('./src/services/auth.service');

// Fail safely at startup if mandatory security configuration is missing
try {
  assertJwtSecretConfigured();
} catch (err) {
  console.error(`FATAL STARTUP ERROR: ${err.message}`);
  process.exit(1);
}

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Student Organization System backend running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
});

// Graceful shutdown handling
const shutdown = () => {
  console.log('Shutting down server gracefully...');
  server.close(() => {
    console.log('Server process terminated.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = server;
