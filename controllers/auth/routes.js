const express = require('express');
const router = express.Router();
const { validate } = require('express-validation')
const { isAuthenticated } = require('../../middlewares/authetication');
const auth = require('./view');
const schema = require('./schema');

router.post('/signup', validate(schema.signup, {}, {}), auth.signup);
router.post('/login', validate(schema.login, {}, {}), auth.login);
router.get('/profile', isAuthenticated(), auth.checkProfile);

module.exports = router;
