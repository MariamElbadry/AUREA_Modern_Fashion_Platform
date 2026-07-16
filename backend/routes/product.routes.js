const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByCategory,
  getNewArrivals,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');
const auth = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

// Public routes — static paths BEFORE /:id
router.get('/', getProducts);
router.get('/new', getNewArrivals);
router.get('/category/:catId', getProductsByCategory);
router.get('/:id', getProductById);

// Admin only
router.post('/', auth, adminOnly, createProduct);
router.put('/:id', auth, adminOnly, updateProduct);
router.delete('/:id', auth, adminOnly, deleteProduct);

module.exports = router;