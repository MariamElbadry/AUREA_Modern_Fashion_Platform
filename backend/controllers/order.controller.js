const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Get all orders for a user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).populate('products.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.userId }).populate('products.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create order from cart
const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Create order
    const order = new Order({
      userId,
      products: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
        isrent: item.isrent
      })),
      totalAmount,
      status: 'pending'
    });

    const savedOrder = await order.save();

    // Clear cart after order is created
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    // Update product quantities
    for (const item of savedOrder.products) {
      if (!item.isrent) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: -item.quantity }
        });
      }
    }

    await savedOrder.populate('products.productId');
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('products.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order (user can cancel their own pending orders)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.userId,
      status: 'pending'
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    // Restore product quantities if not rental
    for (const item of order.products) {
      if (!item.isrent) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.quantity }
        });
      }
    }

    await order.populate('products.productId');
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.productId').populate('userId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
};
