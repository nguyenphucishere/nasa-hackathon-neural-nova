const express = require('express');
const router = express.Router();
const config = require('../config');

// Import route modules
const locationRoutes = require('./location.routes');
const forecastRoutes = require('./forecast.routes');
const searchRoutes = require('./search.routes');

/**
 * Main API Router
 * Mounts all route modules
 */

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env
  });
});

// API info
router.get('/', (req, res) => {
  res.json({
    name: 'Flower Forecast API',
    version: config.api.version,
    description: 'Flower Bloom Forecasting & Travel Recommendation System',
    endpoints: {
      locations: `${config.api.prefix}/locations`,
      forecast: `${config.api.prefix}/forecast`,
      search: `${config.api.prefix}/search`,
      health: '/health'
    },
    documentation: `${config.api.prefix}/docs`
  });
});

// Mount routes
router.use('/locations', locationRoutes);
router.use('/forecast', forecastRoutes);
router.use('/search', searchRoutes);

module.exports = router;
