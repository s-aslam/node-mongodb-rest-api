const express = require('express');
const { validate } = require('express-validation');
const { isAuthenticated } = require('../../middlewares/authetication');
const product = require('./view');
const schema = require('./schema');

const router = express.Router();


router.route('')
  .post(isAuthenticated(), validate(schema.product, {}, {}), product.createProduct)
  .get(isAuthenticated(), validate(schema.product_query, {}, {}), product.listProducts);

router.route('/:id')
  .put(isAuthenticated(), validate(schema.product, {}, {}), product.editProduct)
  .delete(isAuthenticated(), product.deleteProduct)
  .get(isAuthenticated(), product.getProductByID);

module.exports = router;
