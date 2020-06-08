const { Joi } = require('express-validation');

module.exports = {
  category: {
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow('').optional()
    }),
  },
}