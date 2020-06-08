const { Joi } = require('express-validation')

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

module.exports = {
  signup: {
    body: Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().regex(EMAIL_REGEX).required(),
      password: Joi.string().min(6).max(18).required(),
      confirm_password: Joi.string().min(6).max(18).required()
    }),
  },
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().regex(/[a-zA-Z0-9]{6,18}/).required(),
    })
  }
};
