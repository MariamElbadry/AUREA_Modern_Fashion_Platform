const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  Id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  catId: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  designer: {
    type: String,
    required: true
  },
  isRent: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);