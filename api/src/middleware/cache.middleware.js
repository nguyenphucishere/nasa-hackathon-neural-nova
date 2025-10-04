const config = require('../config');
const logger = require('../utils/logger');

/**
 * In-memory cache implementation
 * For production, consider using Redis
 */
class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.ttl = config.cache.ttl * 1000; // Convert to milliseconds
  }

  /**
   * Get value from cache
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    logger.debug(`Cache HIT: ${key}`);
    return item.value;
  }

  /**
   * Set value in cache
   */
  set(key, value, ttl = this.ttl) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
    logger.debug(`Cache SET: ${key} (TTL: ${ttl}ms)`);
  }

  /**
   * Delete from cache
   */
  delete(key) {
    this.cache.delete(key);
    logger.debug(`Cache DELETE: ${key}`);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    logger.info('Cache cleared');
  }

  /**
   * Get cache size
   */
  size() {
    return this.cache.size;
  }

  /**
   * Clean expired entries
   */
  cleanup() {
    const now = Date.now();
    let count = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        count++;
      }
    }

    if (count > 0) {
      logger.info(`Cache cleanup: removed ${count} expired entries`);
    }
  }
}

// Singleton instance
const cacheInstance = new MemoryCache();

// Periodic cleanup (every 5 minutes)
setInterval(() => {
  cacheInstance.cleanup();
}, 5 * 60 * 1000);

/**
 * Cache middleware
 */
function cacheMiddleware(req, res, next) {
  if (!config.cache.enabled) {
    return next();
  }

  // Generate cache key from URL and query params
  const cacheKey = `${req.method}:${req.originalUrl}`;

  // Try to get from cache
  const cachedData = cacheInstance.get(cacheKey);

  if (cachedData) {
    // Return cached response
    return res.status(200).json({
      ...cachedData,
      cached: true,
      timestamp: new Date().toISOString()
    });
  }

  // Store original res.json function
  const originalJson = res.json.bind(res);

  // Override res.json to cache the response
  res.json = function(data) {
    // Only cache successful responses
    if (res.statusCode === 200 && data.success) {
      cacheInstance.set(cacheKey, data);
    }
    return originalJson(data);
  };

  next();
}

module.exports = {
  cacheMiddleware,
  cache: cacheInstance
};
