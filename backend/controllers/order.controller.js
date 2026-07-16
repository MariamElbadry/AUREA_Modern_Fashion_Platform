const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { isValidStatusTransition } = require('../utils/orderStateMachine');

// Get all orders for a user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
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
  const session = await Order.startSession();
  session.startTransaction();
  
  try {
    const userId = req.user.id;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product').session(session);
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate the complete cart before creating an order or clearing it.
    for (const item of cart.items) {
      if (!item.product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'A product in the cart is no longer available' });
      }
      if (item.quantity > item.product.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Insufficient stock for ${item.product.name}` });
      }
      if (item.isRent && !item.product.isRent) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `${item.product.name} is not available for rent` });
      }
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Create order
    const order = new Order({
      user: userId,
      items: cart.items.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.price,
        imageUrl: item.product.imageUrl,
        quantity: item.quantity,
        designer: item.product.designer,
        isRent: item.isRent
      })),
      totalAmount,
      status: 'pending'
    });

    const savedOrder = await order.save({ session });

    // Clear cart after order is created
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save({ session });

    // Update product quantities
    for (const item of savedOrder.items) {
      if (!item.isRent) {
        const product = await Product.findById(item.productId).session(session);
        if (product.quantity < item.quantity) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({ message: 'Insufficient stock for product' });
        }
        product.quantity -= item.quantity;
        await product.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(savedOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate status transition using state machine
    if (!isValidStatusTransition(order.status, status)) {
      return res.status(400).json({ 
        message: `Invalid status transition from '${order.status}' to '${status}'`,
        allowedTransitions: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
      });
    }

    // Restore stock if cancelling a non-rental order
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        if (!item.isRent) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { quantity: item.quantity }
          });
        }
      }
    }

    order.status = status;
    await order.save();

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
      user: req.user.id,
      status: 'pending'
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    // Restore product quantities if not rental
    for (const item of order.items) {
      if (!item.isRent) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.quantity }
        });
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'firstName lastName email role');
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
