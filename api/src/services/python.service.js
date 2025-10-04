const { spawn } = require('child_process');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Python Service
 * Interface to call Python ML models
 */

class PythonService {
  /**
   * Run Python forecast for specific location and date
   * @param {String} aoiName - AOI name from config.yaml
   * @param {String} date - YYYY-MM-DD
   * @param {Object} options - Additional options
   * @returns {Promise} Python execution result
   */
  async runForecast(aoiName, date, options = {}) {
    const {
      models = 'random_forest,lstm',
      threshold = 0.5,
      trainYears = 3
    } = options;

    const args = [
      config.python.scriptPath,
      '--aoi', aoiName,
      '--date', date,
      '--models', models,
      '--threshold', threshold.toString(),
      '--train-years', trainYears.toString()
    ];

    logger.info(`Running Python forecast: ${aoiName} on ${date}`);
    
    return this._executePython(args);
  }

  /**
   * Check if Python environment is available
   */
  async checkPythonEnvironment() {
    try {
      const result = await this._executePython(['--version']);
      logger.info(`Python environment: ${result.stdout}`);
      return true;
    } catch (error) {
      logger.error('Python environment not available:', error);
      return false;
    }
  }

  /**
   * Execute Python script
   * @private
   */
  _executePython(args) {
    return new Promise((resolve, reject) => {
      const python = spawn(config.python.executable, args, {
        cwd: path.resolve(__dirname, '../../..'),
        shell: true
      });

      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        stdout += data.toString();
        logger.debug(`Python stdout: ${data}`);
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
        logger.debug(`Python stderr: ${data}`);
      });

      python.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr, code });
        } else {
          reject(new Error(`Python process exited with code ${code}\n${stderr}`));
        }
      });

      python.on('error', (error) => {
        logger.error('Failed to start Python process:', error);
        reject(error);
      });
    });
  }
}

module.exports = new PythonService();
