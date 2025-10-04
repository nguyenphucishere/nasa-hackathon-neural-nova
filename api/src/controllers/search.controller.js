const matchingService = require('../services/matching.service');
const ApiResponse = require('../utils/response');
const DateUtils = require('../utils/date');
const logger = require('../utils/logger');

/**
 * Search Controller
 * Handles search and recommendation requests
 */

/**
 * Search for locations based on criteria
 * POST /api/v1/search
 * Body: { location, date, month, year, flower, max_results }
 */
async function search(req, res, next) {
  try {
    const { location, date, month, year, flower, max_results } = req.body;

    // Validate date if provided
    if (date && !DateUtils.isValidDate(date)) {
      return ApiResponse.badRequest(res, 'Invalid date format. Use YYYY-MM-DD');
    }

    // Validate month if provided
    if (month && (month < 1 || month > 12)) {
      return ApiResponse.badRequest(res, 'Invalid month. Must be 1-12');
    }

    // Build query
    const query = {
      location: location || null,
      date: date || null,
      month: month || null,
      year: year || new Date().getFullYear(),
      flower: flower || null,
      max_results: max_results || 5
    };

    // Perform search
    const matches = matchingService.search(query);

    // Add rank to each match
    matches.forEach((match, index) => {
      match.rank = index + 1;
    });

    // Calculate summary
    const summary = {
      total_matches: matches.length,
      excellent: matches.filter(m => m.recommendation.verdict === 'excellent').length,
      good: matches.filter(m => m.recommendation.verdict === 'good').length,
      fair: matches.filter(m => m.recommendation.verdict === 'fair').length,
      poor: matches.filter(m => m.recommendation.verdict === 'poor').length
    };

    const data = {
      query,
      matches,
      summary
    };

    logger.info(`Search completed: ${matches.length} matches found`);
    return ApiResponse.success(res, data, 'Search completed successfully');
  } catch (error) {
    logger.error('Error during search:', error);
    next(error);
  }
}

/**
 * Get recommendations for specific month
 * GET /api/v1/recommendations?month=10&year=2025
 */
async function getRecommendations(req, res, next) {
  try {
    const { month, year } = req.query;

    if (!month) {
      return ApiResponse.badRequest(res, 'Month is required');
    }

    const monthNum = parseInt(month, 10);
    if (monthNum < 1 || monthNum > 12) {
      return ApiResponse.badRequest(res, 'Invalid month. Must be 1-12');
    }

    // Search with month only
    const query = {
      location: null,
      date: null,
      month: monthNum,
      year: year ? parseInt(year, 10) : new Date().getFullYear(),
      flower: null,
      max_results: 10
    };

    const matches = matchingService.search(query);

    // Add rank
    matches.forEach((match, index) => {
      match.rank = index + 1;
    });

    // Filter only good matches (in season)
    const recommendations = matches.filter(m => m.in_season);

    logger.info(`Recommendations for month ${month}: ${recommendations.length} locations`);
    return ApiResponse.success(res, recommendations, 'Recommendations retrieved successfully');
  } catch (error) {
    logger.error('Error getting recommendations:', error);
    next(error);
  }
}

module.exports = {
  search,
  getRecommendations
};
