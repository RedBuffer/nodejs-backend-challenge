const Joi = require("joi");

module.exports = {
  email: Joi.string()
    .email()
    .required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  amount: Joi.number()
    .min(0)
    .required()
};
