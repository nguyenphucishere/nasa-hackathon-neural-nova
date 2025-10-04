require('dotenv').config();
const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

/**
 * Server Entry Point
 */

const PORT = config.port;
const HOST = config.host;

// Start server
const server = app.listen(PORT, HOST, () => {
  logger.info('╔════════════════════════════════════════════════════════╗');
  logger.info('║       🌸 Flower Forecast API Server Started 🌸       ║');
  logger.info('╠════════════════════════════════════════════════════════╣');
  logger.info(`║  Environment: ${config.env.padEnd(41)}║`);
  logger.info(`║  Server:      http://${HOST}:${PORT}${' '.repeat(24)}║`);
  logger.info(`║  API:         http://${HOST}:${PORT}${config.api.prefix}${' '.repeat(17)}║`);
  logger.info(`║  Health:      http://${HOST}:${PORT}/health${' '.repeat(19)}║`);
  logger.info('╚════════════════════════════════════════════════════════╝');
});

// Error handling
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use`);
  } else {
    logger.error('Server error:', error);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = server;
