const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const config = require('./config');
const logger = require('./utils/logger');
const corsMiddleware = require('./middleware/cors.middleware');
const { requestLogger } = require('./middleware/logger.middleware');
const { cacheMiddleware } = require('./middleware/cache.middleware');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const apiRoutes = require('./routes/api.routes');

// Load Swagger document
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

/**
 * Express Application Setup
 */

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(corsMiddleware);

// Compression
app.use(compression());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Cache middleware (optional, can disable in config)
if (config.cache.enabled) {
  app.use(cacheMiddleware);
}

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Flower Forecast API',
    version: config.api.version,
    status: 'running',
    endpoints: {
      api: config.api.prefix,
      health: '/health',
      docs: `${config.api.prefix}/docs`
    }
  });
});

// Swagger Documentation
app.use(`${config.api.prefix}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Flower Forecast API Documentation",
  customfavIcon: "/favicon.ico"
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
    memory: process.memoryUsage()
  });
});

// Mount API routes
app.use(config.api.prefix, apiRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
