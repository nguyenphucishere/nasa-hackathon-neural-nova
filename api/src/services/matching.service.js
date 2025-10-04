const DateUtils = require('../utils/date');
const { getAllLocations, getLocationBySlug, getLocationsByMonth } = require('../config/locations');
const logger = require('../utils/logger');

/**
 * Matching Service
 * Search and recommendation algorithm
 */

class MatchingService {
  /**
   * Search for matching locations based on criteria
   * @param {Object} query - Search criteria
   * @returns {Array} Matched locations with scores
   */
  search(query) {
    const { location, date, month, year, flower, max_results = 5 } = query;

    let locations = getAllLocations();
    const matches = [];

    // Filter and score each location
    for (const loc of locations) {
      const match = this._calculateMatch(loc, query);
      
      if (match.score > 0) {
        matches.push(match);
      }
    }

    // Sort by score (highest first)
    matches.sort((a, b) => b.match_score - a.match_score);

    // Limit results
    return matches.slice(0, max_results);
  }

  /**
   * Calculate match score for a location
   * @private
   */
  _calculateMatch(location, query) {
    let score = 0;
    const maxScore = 100;
    const { location: locQuery, date, month, flower } = query;

    // 1. Location match (30 points)
    const locationScore = this._scoreLocation(location, locQuery);
    score += locationScore;

    // 2. Flower match (20 points)
    const flowerScore = this._scoreFlower(location, flower);
    score += flowerScore;

    // 3. Season match (50 points) - MOST IMPORTANT
    const seasonScore = this._scoreSeason(location, date, month);
    score += seasonScore;

    // Calculate match percentage
    const matchScore = Math.round((score / maxScore) * 100);

    // Get best dates for this location
    const bestDates = this._getBestDates(location, date, month, query.year);

    // Determine status
    const inSeason = seasonScore > 0;
    const verdict = this._getVerdict(matchScore, inSeason);

    return {
      rank: 0, // Will be set after sorting
      location: {
        id: location.id,
        name: location.name,
        slug: location.slug,
        flower: location.flower,
        coordinates: {
          latitude: location.location.latitude,
          longitude: location.location.longitude
        }
      },
      match_score: matchScore,
      in_season: inSeason,
      best_dates: bestDates,
      season_info: {
        start: `${location.bloom_season.start_month}/${location.bloom_season.start_day}`,
        end: `${location.bloom_season.end_month}/${location.bloom_season.end_day}`,
        peak_months: location.bloom_season.peak_months,
        status: inSeason ? 'in_season' : 'out_of_season'
      },
      recommendation: {
        verdict,
        message: this._getMessage(verdict, location),
        tips: location.tips
      }
    };
  }

  /**
   * Score location match
   * @private
   */
  _scoreLocation(location, locQuery) {
    if (!locQuery || locQuery === 'any') {
      return 30; // All locations qualify
    }

    const query = locQuery.toLowerCase();
    const slug = location.slug.toLowerCase();
    const name = location.name.toLowerCase();

    if (slug === query) {
      return 30; // Exact slug match
    }

    if (slug.includes(query) || name.includes(query)) {
      return 20; // Partial match
    }

    return 0;
  }

  /**
   * Score flower match
   * @private
   */
  _scoreFlower(location, flowerQuery) {
    if (!flowerQuery || flowerQuery === 'any') {
      return 20; // All flowers qualify
    }

    const query = flowerQuery.toLowerCase();
    const species = location.flower.species.toLowerCase();
    const commonName = location.flower.common_name.toLowerCase();

    if (species === query || commonName === query) {
      return 20; // Exact match
    }

    if (species.includes(query) || commonName.includes(query)) {
      return 15; // Partial match
    }

    return 0;
  }

  /**
   * Score season match
   * @private
   */
  _scoreSeason(location, date, month) {
    const season = location.bloom_season;
    const peakMonths = season.peak_months;

    // If specific date provided
    if (date) {
      const inSeason = DateUtils.isInBloomSeason(date, season);
      if (!inSeason) return 0;

      const { month: dateMonth } = DateUtils.getMonthDay(date);
      
      // Peak month
      if (peakMonths.includes(dateMonth)) {
        return 50;
      }
      
      // In season but not peak
      return 30;
    }

    // If only month provided
    if (month) {
      // Peak month
      if (peakMonths.includes(month)) {
        return 50;
      }

      // Check if in season
      const { start_month, end_month } = season;
      
      // Same year bloom
      if (start_month <= end_month) {
        if (month >= start_month && month <= end_month) {
          return 30;
        }
      } else {
        // Cross-year bloom
        if (month >= start_month || month <= end_month) {
          return 30;
        }
      }
    }

    return 0;
  }

  /**
   * Get best dates for location
   * @private
   */
  _getBestDates(location, date, month, year) {
    const currentYear = year || new Date().getFullYear();
    const peakMonths = location.bloom_season.peak_months;
    const bestDates = [];

    // If specific date provided, return dates around it
    if (date) {
      const targetDate = DateUtils.parseDate(date);
      const { month: targetMonth } = DateUtils.getMonthDay(date);
      
      // If in peak month, return date itself and nearby dates
      if (peakMonths.includes(targetMonth)) {
        bestDates.push({
          date: DateUtils.formatDate(targetDate),
          probability: 0.9 + Math.random() * 0.05,
          confidence: 'high',
          label: 'Peak bloom'
        });
      }
      
      return bestDates;
    }

    // If month provided, return best dates in that month
    if (month && peakMonths.includes(month)) {
      // Generate some dates in peak month
      for (let day = 10; day <= 25; day += 5) {
        const dateStr = `${currentYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        bestDates.push({
          date: dateStr,
          probability: 0.85 + Math.random() * 0.1,
          confidence: 'high',
          label: day === 15 ? 'Peak bloom' : 'Near peak'
        });
      }
    }

    return bestDates;
  }

  /**
   * Get verdict based on match score
   * @private
   */
  _getVerdict(score, inSeason) {
    if (!inSeason) return 'poor';
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    return 'fair';
  }

  /**
   * Get recommendation message
   * @private
   */
  _getMessage(verdict, location) {
    const messages = {
      excellent: `Perfect time to visit ${location.name}! Peak bloom season 🎉`,
      good: `Good time to visit ${location.name}. Flowers are blooming! 🌸`,
      fair: `Fair time to visit. Early or late in bloom season. 🌱`,
      poor: `Not recommended. Outside bloom season. ❌`
    };

    return messages[verdict] || messages.fair;
  }
}

module.exports = new MatchingService();
