const { Joi, celebrate } = require("celebrate");

const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string min": 'The minimum length of the "name" field is 2',
      "string max": 'The maximum length of the "name" field is 30',
      "string empty": 'The "name" field must be filled in',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "string empty": 'Please fill out one of the "weather" fields',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string empty": "A valid URL is required",
    }),
  }),
});

module.exports.validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string min": 'The minimum length of the "name" field is 2',
      "string max": 'The maximum length for the "name" field is 30',
      "string empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
    email: Joi.string().required().email().messages({
      "string empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().min(8).messages({
      "string min": 'The minimum length for the "password" field is 8',
      "sting empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "sting empty": 'The "email" field must be filled in',
      "sting.email": 'The "email" field must be a valid Email',
    }),
    password: Joi.string().required().min(8).messages({
      "string min": 'The minimum length for the "password" field is 8',
      "sting empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24),
  }),
});
