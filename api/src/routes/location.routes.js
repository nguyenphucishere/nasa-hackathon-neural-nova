const express = require('express');
const router = express.Router();
const { getLocations, getLocationBySlugController } = require('../controllers/location.controller');

/**
 * Location Routes
 */

// Get all locations
router.get('/', getLocations);

// Get location by slug
router.get('/:slug', getLocationBySlugController);

module.exports = router;
