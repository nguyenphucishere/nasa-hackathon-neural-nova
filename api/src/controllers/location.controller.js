const { getAllLocations, getLocationBySlug } = require('../config/locations');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Location Controller
 * Handles location-related requests
 */

/**
 * Get all locations
 * GET /api/v1/locations
 */
async function getLocations(req, res, next) {
  try {
    const locations = getAllLocations();
    
    // Format response
    const data = locations.map(loc => ({
      id: loc.id,
      name: loc.name,
      slug: loc.slug,
      flower: loc.flower,
      location: loc.location,
      bloom_season: {
        start: `${loc.bloom_season.start_month}/${loc.bloom_season.start_day}`,
        end: `${loc.bloom_season.end_month}/${loc.bloom_season.end_day}`,
        peak_months: loc.bloom_season.peak_months,
        duration_days: loc.bloom_season.duration_days
      },
      images: loc.images,
      description: loc.description
    }));

    logger.info(`Retrieved ${data.length} locations`);
    return ApiResponse.success(res, data, 'Locations retrieved successfully');
  } catch (error) {
    logger.error('Error getting locations:', error);
    next(error);
  }
}

/**
 * Get location by slug
 * GET /api/v1/locations/:slug
 */
async function getLocationBySlugController(req, res, next) {
  try {
    const { slug } = req.params;
    const location = getLocationBySlug(slug);

    if (!location) {
      return ApiResponse.notFound(res, `Location not found: ${slug}`);
    }

    logger.info(`Retrieved location: ${slug}`);
    return ApiResponse.success(res, location, 'Location retrieved successfully');
  } catch (error) {
    logger.error('Error getting location:', error);
    next(error);
  }
}

module.exports = {
  getLocations,
  getLocationBySlugController
};
