const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');
const auth = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin only routes (protected)
router.post('/', auth, adminOnly, createCategory);
router.put('/:id', auth, adminOnly, updateCategory);
router.delete('/:id', auth, adminOnly, deleteCategory);

module.exports = router;
