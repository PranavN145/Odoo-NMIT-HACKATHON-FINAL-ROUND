/**
 * Centralized Error Handling Middleware
 * Catches unhandled errors and formats consistent JSON error responses.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  const response = {
    status: 'error',
    message: statusCode === 500 && isProduction
      ? 'Internal server error'
      : err.message || 'An unexpected error occurred'
  };

  // Expose stack trace only during local non-production development for debugging
  if (!isProduction && statusCode === 500 && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
