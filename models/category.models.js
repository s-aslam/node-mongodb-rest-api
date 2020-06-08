const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true
    }
  }, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// add plugin that converts mongoose to json
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

// Check if name is exists
categorySchema.statics.isNameExists = async function (name, excludeId) {
  const category = await this.findOne({ name, _id: { $ne: excludeId } });
  return !!category;
};


/**
 * @typedef category
 */
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
