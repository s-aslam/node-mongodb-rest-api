const { toJSON, paginate } = require('./plugins');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema({
  is_active: {
    type: Boolean,
    default: true
  },
  name: {
    type: String,
    require: true
  },
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
    required: true,
  },
  description: {
    type: String,
    trim: true 
  },
  price: {
    type: Number,
    require: true
  },
  net_price: {
    type: Number,
    require: true
  },
  discount: {
    type: Number,
    require: true
  },
}, {
  timestamp: true
});

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);


// Check if name is exists
productSchema.statics.isNameExists = async function (name, id) {
  const product = await this.findOne({ name, _id: { $ne: id } });
  return !!product;
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;


