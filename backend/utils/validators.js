const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

// Middleware to validate a single ObjectId param (default: 'id')
const validateObjectId = (param = 'id') => (req, res, next) => {
  const id = req.params[param];
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: `Invalid ${param}` });
  }
  next();
};

// Middleware to handle express-validator errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array().map(e => e.msg).join(', ')
    });
  }
  next();
};

module.exports = {
  validateObjectId,
  validate
}; 