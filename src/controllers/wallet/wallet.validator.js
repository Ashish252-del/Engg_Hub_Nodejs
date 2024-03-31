const { validate, ValidationError, Joi } = require("express-validation");

module.exports.placeBet = {
  body: Joi.object({
    amount: Joi.number().required(),
  }),
};
module.exports.payout = {
  body: Joi.object({
    amount: Joi.number().required(),
  }),
};
module.exports.refund = {
  body: Joi.object({
    reference: Joi.string().required(),
  }),
};
