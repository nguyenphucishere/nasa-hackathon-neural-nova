const path = require('path');
const fs = require('fs').promises;
const DateUtils = require('../utils/date');
const logger = require('../utils/logger');
const { getLocationBySlug, getLocationByAOI } = require('../config/locations');

/**
 * Forecast Service
 * Handles all forecast-related business logic
 */

class ForecastService {
  constructor() {
    this.outputDir = path.resolve(__dirname, '../../../outputs');
  }

  /**
   * Get forecast for specific location and date
   * @param {String} locationSlug
   * @param {String} date - YYYY-MM-DD
   * @returns {Object} Forecast data
   */
  async getForecast(locationSlug, date) {
    const location = getLocationBySlug(locationSlug);
    
    if (!location) {
      throw new Error(`Location not found: ${locationSlug}`);
    }

    // Check if in bloom season
    const inSeason = DateUtils.isInBloomSeason(date, location.bloom_season);

    // Try to load forecast from Python outputs
    const forecastData = await this._loadForecastFromOutputs(location.aoi_name, date);

    return {
      location: {
        id: location.id,
        name: location.name,
        slug: location.slug
      },
      date,
      in_season: inSeason,
      forecast: forecastData || this._generateMockForecast(location, date, inSeason)
    };
  }

  /**
   * Get forecasts for date range
   * @param {String} locationSlug
   * @param {String} startDate
   * @param {String} endDate
   * @returns {Array} Array of forecasts
   */
  async getForecastRange(locationSlug, startDate, endDate) {
    const location = getLocationBySlug(locationSlug);
    
    if (!location) {
      throw new Error(`Location not found: ${locationSlug}`);
    }

    const dates = DateUtils.generateDateRange(startDate, endDate);
    const forecasts = [];

    for (const date of dates) {
      const inSeason = DateUtils.isInBloomSeason(date, location.bloom_season);
      const forecastData = await this._loadForecastFromOutputs(location.aoi_name, date);
      
      forecasts.push({
        date,
        probability: forecastData?.probability || this._estimateProbability(location, date, inSeason),
        confidence: forecastData?.confidence || (inSeason ? 'medium' : 'low'),
        in_season: inSeason
      });
    }

    return forecasts;
  }

  /**
   * Get hotspots for specific date
   * @param {String} locationSlug
   * @param {String} date
   * @returns {Object} Hotspots data
   */
  async getHotspots(locationSlug, date) {
    const location = getLocationBySlug(locationSlug);
    
    if (!location) {
      throw new Error(`Location not found: ${locationSlug}`);
    }

    // Try to load hotspots from Python outputs
    const hotspots = await this._loadHotspotsFromOutputs(location.aoi_name, date);

    return {
      location: location.name,
      date,
      hotspots_count: hotspots?.length || 0,
      hotspots: hotspots || []
    };
  }

  /**
   * Load forecast from Python output files
   * @private
   */
  async _loadForecastFromOutputs(aoiName, date) {
    try {
      const predictionsPath = path.join(
        this.outputDir,
        'predictions',
        aoiName,
        `${aoiName}_predictions_${date}.csv`
      );

      // Check if file exists
      await fs.access(predictionsPath);
      
      // File exists - return basic info
      // In production, parse CSV and calculate stats
      return {
        probability: 0.75,
        confidence: 'high',
        model_used: 'lstm',
        computed_at: new Date().toISOString()
      };
    } catch (error) {
      // File not found - return null
      logger.debug(`Forecast file not found for ${aoiName} on ${date}`);
      return null;
    }
  }

  /**
   * Load hotspots from Python output files
   * @private
   */
  async _loadHotspotsFromOutputs(aoiName, date) {
    try {
      const hotspotsPath = path.join(
        this.outputDir,
        'hotspots',
        aoiName,
        `${aoiName}_hotspots.csv`
      );

      // Check if file exists
      await fs.access(hotspotsPath);
      
      // File exists - return mock data
      // In production, parse CSV file
      return [
        {
          latitude: 23.15,
          longitude: 105.2,
          probability: 0.95,
          gi_z_score: 3.45,
          cluster_id: 1
        }
      ];
    } catch (error) {
      logger.debug(`Hotspots file not found for ${aoiName} on ${date}`);
      return [];
    }
  }

  /**
   * Generate mock forecast (when Python data not available)
   * @private
   */
  _generateMockForecast(location, date, inSeason) {
    const probability = this._estimateProbability(location, date, inSeason);
    
    return {
      probability,
      confidence: inSeason ? 'medium' : 'low',
      status: inSeason ? 'in_season' : 'out_of_season',
      model_used: 'mock',
      note: 'Mock data - run Python models for actual predictions'
    };
  }

  /**
   * Estimate probability based on bloom season
   * @private
   */
  _estimateProbability(location, date, inSeason) {
    if (!inSeason) return 0.1;

    const { month } = DateUtils.getMonthDay(date);
    const { peak_months } = location.bloom_season;

    // Higher probability during peak months
    if (peak_months.includes(month)) {
      return 0.85 + Math.random() * 0.1; // 0.85-0.95
    }

    // Medium probability in non-peak but in-season
    return 0.6 + Math.random() * 0.15; // 0.6-0.75
  }
}

module.exports = new ForecastService();
