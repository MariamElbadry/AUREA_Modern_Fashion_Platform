const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : true)
    : ['http://localhost:4200', 'http://127.0.0.1:4200', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Vercel reuses this Express app across warm requests. connectDB caches the
// active connection, so this is fast locally and avoids connection storms in
// serverless production.
app.use(async (request, response, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    response.status(503).json({ message: 'Database connection unavailable' });
  }
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/orders', require('./routes/order.routes'));

module.exports = app;
