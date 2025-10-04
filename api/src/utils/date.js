const { format, parse, isValid, parseISO, addDays, subDays, differenceInDays } = require('date-fns');

/**
 * Date utility functions
 */

class DateUtils {
  /**
   * Format date to YYYY-MM-DD
   * @param {Date|String} date
   * @returns {String}
   */
  static formatDate(date) {
    if (typeof date === 'string') {
      date = parseISO(date);
    }
    return format(date, 'yyyy-MM-dd');
  }

  /**
   * Parse date string to Date object
   * @param {String} dateString - Date in YYYY-MM-DD format
   * @returns {Date}
   */
  static parseDate(dateString) {
    return parseISO(dateString);
  }

  /**
   * Check if date string is valid
   * @param {String} dateString
   * @returns {Boolean}
   */
  static isValidDate(dateString) {
    try {
      const date = parseISO(dateString);
      return isValid(date);
    } catch {
      return false;
    }
  }

  /**
   * Get current date in YYYY-MM-DD format
   * @returns {String}
   */
  static today() {
    return format(new Date(), 'yyyy-MM-dd');
  }

  /**
   * Check if date is in range
   * @param {String} date - Date to check
   * @param {String} startDate - Range start
   * @param {String} endDate - Range end
   * @returns {Boolean}
   */
  static isInRange(date, startDate, endDate) {
    const d = parseISO(date);
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return d >= start && d <= end;
  }

  /**
   * Get month and day from date
   * @param {String} dateString - YYYY-MM-DD
   * @returns {Object} { month, day }
   */
  static getMonthDay(dateString) {
    const date = parseISO(dateString);
    return {
      month: date.getMonth() + 1, // 1-12
      day: date.getDate()
    };
  }

  /**
   * Check if date is in bloom season
   * @param {String} dateString - YYYY-MM-DD
   * @param {Object} season - { start_month, start_day, end_month, end_day }
   * @returns {Boolean}
   */
  static isInBloomSeason(dateString, season) {
    const { month, day } = this.getMonthDay(dateString);
    const { start_month, start_day, end_month, end_day } = season;

    // Same year bloom (e.g., March to May)
    if (start_month <= end_month) {
      if (month < start_month || month > end_month) return false;
      if (month === start_month && day < start_day) return false;
      if (month === end_month && day > end_day) return false;
      return true;
    }
    
    // Cross-year bloom (e.g., October to February)
    if (month >= start_month) {
      if (month === start_month && day < start_day) return false;
      return true;
    }
    if (month <= end_month) {
      if (month === end_month && day > end_day) return false;
      return true;
    }
    
    return false;
  }

  /**
   * Generate date range
   * @param {String} startDate - YYYY-MM-DD
   * @param {String} endDate - YYYY-MM-DD
   * @returns {Array<String>} Array of dates
   */
  static generateDateRange(startDate, endDate) {
    const dates = [];
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const days = differenceInDays(end, start);

    for (let i = 0; i <= days; i++) {
      dates.push(this.formatDate(addDays(start, i)));
    }

    return dates;
  }

  /**
   * Get date N days ago
   * @param {Number} days
   * @returns {String}
   */
  static daysAgo(days) {
    return this.formatDate(subDays(new Date(), days));
  }

  /**
   * Get date N days from now
   * @param {Number} days
   * @returns {String}
   */
  static daysFromNow(days) {
    return this.formatDate(addDays(new Date(), days));
  }
}

module.exports = DateUtils;
