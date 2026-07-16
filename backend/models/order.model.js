const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:      String,
  price:     Number,
  imageUrl:  String,
  quantity:  Number,
  designer:  String,
  isRent:    { type: Boolean, default: false }
});

const orderSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:       [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status:      { type: String, enum: ['pending','confirmed','shipped','delivered','cancelled'], default: 'confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);