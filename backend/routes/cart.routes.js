const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  incrementItem,
  decrementItem,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cart.controller');
const auth = require('../middleware/auth.middleware');

router.use(auth);

router.get('/',                         getCart);
router.post('/add',                     addToCart);
router.put('/increment',                incrementItem);   // + button
router.put('/decrement',                decrementItem);   // - button
router.put('/update',                   updateCartItem);
router.delete('/remove/:productId/:isRent', removeFromCart);
router.delete('/clear',                 clearCart);

module.exports = router;