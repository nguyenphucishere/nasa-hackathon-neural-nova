const logger = require('../utils/logger');

/**
 * Request logging middleware
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  // Log request
  logger.info(`→ ${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`← ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });

  next();
}

module.exports = {
  requestLogger
};
