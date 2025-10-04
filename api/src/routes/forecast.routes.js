const express = require('express');
const router = express.Router();
const { getForecast, getForecastRange, getHotspots } = require('../controllers/forecast.controller');

/**
 * Forecast Routes
 */

// Get forecast for specific date
router.get('/:location_slug/:date', getForecast);

// Get forecast for date range
router.get('/:location_slug/range', getForecastRange);

// Get hotspots for specific date (moved to separate path to avoid conflict)
router.get('/hotspots/:location_slug/:date', getHotspots);

module.exports = router;
