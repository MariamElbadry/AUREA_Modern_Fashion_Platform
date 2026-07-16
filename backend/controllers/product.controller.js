const Product = require('../models/product.model');
const { filterFields, allowedProductFields } = require('../utils/validators');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ Id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ catId: req.params.catId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get new arrivals
const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNew: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product (admin only)
const createProduct = async (req, res) => {
  try {
    const filteredBody = filterFields(req.body, allowedProductFields);
    const product = new Product(filteredBody);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product (admin only)
const updateProduct = async (req, res) => {
  try {
    const filteredBody = filterFields(req.body, allowedProductFields);
    const product = await Product.findOneAndUpdate(
      { Id: req.params.id },
      filteredBody,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ Id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  getNewArrivals,
  createProduct,
  updateProduct,
  deleteProduct
};
