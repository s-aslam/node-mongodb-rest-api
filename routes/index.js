const express = require('express');
const router = express.Router();
const authRoutes = require('../controllers/auth/routes');
const productRoutes = require('../controllers/product/routes');
const categoryRoutes = require('../controllers/category/routes');

const { isAuthenticated } = require('../middlewares/authetication');
const category = require('../controllers/category/view');

router.use('/auth', authRoutes);
router.use('/category', categoryRoutes);
router.use('/product', productRoutes);
router.get('/category-list', isAuthenticated(), category.listAllCategory);

module.exports = router;
