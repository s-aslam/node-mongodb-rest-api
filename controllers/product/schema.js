const { Joi } = require('express-validation');

module.exports = {
  product: {
    body: Joi.object({
      name: Joi.string().required(),
      category: Joi.string().required(),
      price: Joi.number().required(),
      discount: Joi.number().required(),
      net_price: Joi.number().required(),
      description: Joi.string().allow('').optional()
    }),
  },
  product_query: {
    query: Joi.object({
      from_price: Joi.number().allow('').optional(),
      to_price: Joi.number().allow('').optional(),
      sortBy: Joi.string().allow('').optional(),
      limit: Joi.number().allow('').optional(),
      page: Joi.number().allow('').optional(),
    }),
  }
}