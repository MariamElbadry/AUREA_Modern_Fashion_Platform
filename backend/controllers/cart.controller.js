const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

async function getPopulatedCart(userId) {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name price imageUrl designer catId isRent isNew quantity Id'
  });
  if (!cart) return { items: [], totalPrice: 0 };
  return cart;
}

// GET /api/cart
const getCart = async (req, res) => {
  try {
    res.json(await getPopulatedCart(req.user.id));
  } catch (err) {
    console.error('getCart:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, isRent = false } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const product = await Product.findOne({ Id: Number(productId) });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    const existingIndex = cart.items.findIndex(
      (i) => i.product.toString() === product._id.toString() && i.isRent === isRent
    );

    const currentQty = existingIndex >= 0 ? cart.items[existingIndex].quantity : 0;
    const newQty = currentQty + Number(quantity);

    if (!isRent && newQty > product.quantity) {
      return res.status(400).json({
        message: `Only ${product.quantity - currentQty} more unit(s) available in stock`
      });
    }

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = product.price;
    } else {
      cart.items.push({ product: product._id, quantity: Number(quantity), price: product.price, isRent });
    }

    await cart.save();
    res.json(await getPopulatedCart(req.user.id));
  } catch (err) {
    console.error('addToCart:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/cart/increment  — + button
const incrementItem = async (req, res) => {
  try {
    const { productId, isRent = false } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required' });

    const product = await Product.findOne({ Id: Number(productId) });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(
      (i) => i.product.toString() === product._id.toString() && i.isRent === isRent
    );
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    if (!isRent && item.quantity + 1 > product.quantity) {
      return res.status(400).json({ message: `Maximum available stock is ${product.quantity}` });
    }

    item.quantity += 1;
    item.price = product.price;
    await cart.save();
    res.json(await getPopulatedCart(req.user.id));
  } catch (err) {
    console.error('incrementItem:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/cart/decrement  — - button
const decrementItem = async (req, res) => {
  try {
    const { productId, isRent = false } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required' });

    const product = await Product.findOne({ Id: Number(productId) });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      (i) => i.product.toString() === product._id.toString() && i.isRent === isRent
    );
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not in cart' });

    if (cart.items[itemIndex].quantity <= 1) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity -= 1;
    }

    await cart.save();
    res.json(await getPopulatedCart(req.user.id));
  } catch (err) {
    console.error('decrementItem:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/cart/update  — set exact quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, isRent = false } = req.body;
    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'productId and quantity are required' });
    }

    const product = await Product.findOne({ Id: Number(productId) });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      (i) => i.product.toString() === product._id.toString() && i.isRent === isRent
    );
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not in cart' });

    if (Number(quantity) <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      if (!isRent && Number(quantity) > product.quantity) {
        return res.status(400).json({ message: `Only ${product.quantity} unit(s) available in stock` });
      }
      cart.items[itemIndex].quantity = Number(quantity);
      cart.items[itemIndex].price = product.price;
    }

    await cart.save();
    res.json(await getPopulatedCart(req.user.id));
  } catch (err) {
    console.error('updateCartItem:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/cart/remove/:productId/:isRent
const removeFromCart = async (req, res) => {
  try {
    const isRentBool = req.params.isRent === 'true';

    const product = await Product.findOne({ Id: Number(req.params.productId) });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      (i) => !(i.product.toString() === product._id.toString() && i.isRent === isRentBool)
    );

    await cart.save();
    res.json(await getPopulatedCart(req.user.id));
  } catch (err) {
    console.error('removeFromCart:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = [];
    await cart.save();
    res.json({ items: [], totalPrice: 0 });
  } catch (err) {
    console.error('clearCart:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getCart,
  addToCart,
  incrementItem,
  decrementItem,
  updateCartItem,
  removeFromCart,
  clearCart
};