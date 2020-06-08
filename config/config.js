require('dotenv').config();//instatiate environment variables

const CONFIG = {
  //Make this global to use all over the application

  app: process.env.APP || 'dev',
  port: process.env.PORT || '3000',

  email: process.env.email || 'abc@gmail.com',
  password: process.env.password || '3000',

  db_dialect: process.env.DB_DIALECT || 'mongodb',
  db_host: process.env.DB_HOST || 'localhost',
  db_port: process.env.DB_PORT || '27017',
  db_name: process.env.DB_NAME || 'practical_test',

  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },

  BCRYPT_ROUND_FOR_PASSWORD: process.env.BCRYPT_ROUND_FOR_PASSWORD,
  PBKDF2_N_SALT_BYTES: process.env.PBKDF2_N_SALT_BYTES,
  SECRET_HEX: process.env.SECRET_HEX,

};
module.exports = CONFIG;
