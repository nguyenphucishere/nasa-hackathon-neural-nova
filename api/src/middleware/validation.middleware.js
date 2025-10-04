const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/response');

/**
 * Validation result handler
 */
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value
    }));

    return ApiResponse.badRequest(
      res,
      'Validation failed',
      errorMessages
    );
  }

  next();
}

module.exports = {
  validateRequest
};
