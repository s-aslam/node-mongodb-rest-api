const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    created_at : { type : Date, default: Date.now }
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = mongoose.model('auth_token', tokenSchema);
module.exports = Token;
