require('dotenv').config();

/**
 * Application configuration
 */

module.exports = {
  // Server
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  host: process.env.HOST || '0.0.0.0',

  // API
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: process.env.API_PREFIX || '/api/v1',
    maxResults: parseInt(process.env.MAX_RESULTS, 10) || 10
  },

  // Python integration
  python: {
    executable: process.env.PYTHON_EXECUTABLE || 'python',
    scriptPath: process.env.PYTHON_SCRIPT_PATH || '../main.py',
    outputDir: process.env.PYTHON_OUTPUT_DIR || '../outputs',
    configPath: process.env.PYTHON_CONFIG_PATH || '../config.yaml'
  },

  // Cache
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true',
    ttl: parseInt(process.env.CACHE_TTL, 10) || 3600 // 1 hour
  },

  // Logging
  log: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/api.log'
  },

  // CORS
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://localhost:5173']
  }
};
