const { User } = require('../../models');
const httpStatus = require('http-status');
const tokenService = require('../../services/token.service');

const signup = async (req, res) => {
  const data = req.body;
  if (data.password !== data.confirm_password){
    res.status(httpStatus.BAD_REQUEST).send({ 'error': 'Password is not matched' });
  }
  if (await User.isEmailTaken(data.email)) {
    res.status(httpStatus.BAD_REQUEST).send({ 'error': 'Email already exists' });
  }
  await User.create(data);
  res.status(httpStatus.CREATED).send({ 'message': 'Sign up Successfull' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || ! await user.checkPassword(password)) {
    res.status(httpStatus.NOT_FOUND).send({ 'error': 'Incorrect email or password' });
  }
  if (!user.is_active) {
    res.status(httpStatus.NOT_FOUND).send({ 'error': 'Your account is Inactive' });
  }
  const token = await tokenService.generateAuthTokens(user);
  res.send({ user, token });
};

const checkProfile = async (req, res) => {
  const user = req.user;
  res.send({ user });
}

module.exports = {
  signup,
  login,
  checkProfile
}