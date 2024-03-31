const { errorResponse } = require('../helpers');
const { ValidationError } = require("express-validation");

// eslint-disable-next-line no-unused-vars
const errorHandlerOld = (err, req, res, next) => {
  if (err && err.message === 'validation error') {
    let messages = err.errors.map(e => e.field);
    if (messages.length && messages.length > 1) {
      messages = `${messages.join(', ')} are required fields`;
    } else {
      messages = `${messages.join(', ')} is required field`;
    }
    return errorResponse(req, res, messages, 400, err);
  }
};
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    let errors = Object.values(err.details).flat()[0]
    return errorResponse(req, res, errors.message.replace(/\"/g, ""), 400, err);
  }
  return errorResponse(req, res, err.message, 400, err);
};

module.exports = errorHandler;
