const express = require('express');
const router = express.Router();
const {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
} = require('../controllers/order.controller');
const auth = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

// Admin — must be BEFORE /:id
router.get('/all', auth, adminOnly, getAllOrders);

// User routes
router.get('/', auth, getUserOrders);
router.get('/:id', auth, getOrderById);
router.post('/', auth, createOrder);
router.put('/:id/cancel', auth, cancelOrder);
router.put('/:id/status', auth, adminOnly, updateOrderStatus);

module.exports = router;