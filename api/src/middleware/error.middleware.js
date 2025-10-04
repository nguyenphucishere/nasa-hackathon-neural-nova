const logger = require('../utils/logger');
const ApiResponse = require('../utils/response');

/**
 * Global error handling middleware
 */
function errorHandler(err, req, res, next) {
  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  }

  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  }

  if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource Not Found';
  }

  // Send error response
  return ApiResponse.error(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
  );
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res, next) {
  logger.warn(`Route not found: ${req.method} ${req.url}`);
  return ApiResponse.notFound(res, `Route ${req.method} ${req.url} not found`);
}

/**
 * Async error wrapper
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
