const express = require('express');
const { validate } = require('express-validation');
const { isAuthenticated } = require('../../middlewares/authetication');
const category = require('./view');
const schema = require('./schema');

const router = express.Router();


router
  .route('')
    .post(isAuthenticated(), validate(schema.category, {}, {}), category.createCategory)
    .get(isAuthenticated(), category.listCategory);

router
  .route('/:id')
    .put(isAuthenticated(), validate(schema.category, {}, {}), category.editCategory)
    .delete(isAuthenticated(), category.deleteCategory)
    .get(isAuthenticated(), category.getCategoryByID);


module.exports = router;
