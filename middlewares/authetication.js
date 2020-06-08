const httpStatus = require('http-status');
const tokenService = require('../services/token.service');

/**
 * Check Authentication from Headers
**/
module.exports.isAuthenticated = () => {
  return async (req, res, next) => {
    try {
      let token = req.headers.authorization;
      if (!token) {
        return res.status(httpStatus.FORBIDDEN).send({ 'message': 'Unauthorized access' });
      }
      token = token.split(' ');
      if (token[0] != 'Token') {
        return res.status(httpStatus.FORBIDDEN).send({ 'message': 'Invalid Token' });
      }
      token_obj = await tokenService.verifyToken(token[1]);

      if (!token_obj) {
        return res.status(httpStatus.FORBIDDEN).send({ 'message': 'Invalid Token' });
      }
      req.user = token_obj.user;
      next();
    } catch (err) {
      return res.status(400).json({ message: 'Error name: ' + err.name + 'Error message: ' + err.message })
    }
  }
}
