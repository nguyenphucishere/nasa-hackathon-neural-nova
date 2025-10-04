const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { search, getRecommendations } = require('../controllers/search.controller');
const { validateRequest } = require('../middleware/validation.middleware');

/**
 * Search Routes
 */

// Search with criteria
router.post(
  '/',
  [
    body('location').optional().isString(),
    body('date').optional().matches(/^\d{4}-\d{2}-\d{2}$/),
    body('month').optional().isInt({ min: 1, max: 12 }),
    body('year').optional().isInt({ min: 2015, max: 2030 }),
    body('flower').optional().isString(),
    body('max_results').optional().isInt({ min: 1, max: 20 })
  ],
  validateRequest,
  search
);

// Get recommendations for month
router.get('/recommendations', getRecommendations);

module.exports = router;
