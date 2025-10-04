const forecastService = require('../services/forecast.service');
const ApiResponse = require('../utils/response');
const DateUtils = require('../utils/date');
const logger = require('../utils/logger');

/**
 * Forecast Controller
 * Handles forecast-related requests
 */

/**
 * Get forecast for specific location and date
 * GET /api/v1/forecast/:location_slug/:date
 */
async function getForecast(req, res, next) {
  try {
    const { location_slug, date } = req.params;

    // Validate date format
    if (!DateUtils.isValidDate(date)) {
      return ApiResponse.badRequest(res, 'Invalid date format. Use YYYY-MM-DD');
    }

    const forecast = await forecastService.getForecast(location_slug, date);

    logger.info(`Retrieved forecast for ${location_slug} on ${date}`);
    return ApiResponse.success(res, forecast, 'Forecast retrieved successfully');
  } catch (error) {
    if (error.message.includes('not found')) {
      return ApiResponse.notFound(res, error.message);
    }
    logger.error('Error getting forecast:', error);
    next(error);
  }
}

/**
 * Get forecast for date range
 * GET /api/v1/forecast/:location_slug/range?start=YYYY-MM-DD&end=YYYY-MM-DD
 */
async function getForecastRange(req, res, next) {
  try {
    const { location_slug } = req.params;
    const { start, end } = req.query;

    // Validate dates
    if (!start || !end) {
      return ApiResponse.badRequest(res, 'Both start and end dates are required');
    }

    if (!DateUtils.isValidDate(start) || !DateUtils.isValidDate(end)) {
      return ApiResponse.badRequest(res, 'Invalid date format. Use YYYY-MM-DD');
    }

    const forecasts = await forecastService.getForecastRange(location_slug, start, end);

    // Find peak date
    const peakForecast = forecasts.reduce((max, f) => 
      f.probability > max.probability ? f : max, forecasts[0]);

    const data = {
      location: location_slug,
      range: { start, end },
      forecasts,
      peak_date: {
        date: peakForecast.date,
        probability: peakForecast.probability
      }
    };

    logger.info(`Retrieved forecast range for ${location_slug}: ${start} to ${end}`);
    return ApiResponse.success(res, data, 'Forecast range retrieved successfully');
  } catch (error) {
    if (error.message.includes('not found')) {
      return ApiResponse.notFound(res, error.message);
    }
    logger.error('Error getting forecast range:', error);
    next(error);
  }
}

/**
 * Get hotspots for specific date
 * GET /api/v1/hotspots/:location_slug/:date
 */
async function getHotspots(req, res, next) {
  try {
    const { location_slug, date } = req.params;

    // Validate date format
    if (!DateUtils.isValidDate(date)) {
      return ApiResponse.badRequest(res, 'Invalid date format. Use YYYY-MM-DD');
    }

    const hotspots = await forecastService.getHotspots(location_slug, date);

    logger.info(`Retrieved ${hotspots.hotspots_count} hotspots for ${location_slug} on ${date}`);
    return ApiResponse.success(res, hotspots, 'Hotspots retrieved successfully');
  } catch (error) {
    if (error.message.includes('not found')) {
      return ApiResponse.notFound(res, error.message);
    }
    logger.error('Error getting hotspots:', error);
    next(error);
  }
}

module.exports = {
  getForecast,
  getForecastRange,
  getHotspots
};
