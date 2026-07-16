require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : true)
    : ['http://localhost:4200', 'http://127.0.0.1:4200', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));  
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/orders', require('./routes/order.routes'));

// Serve the compiled Angular app from this same server. This gives production
// deployments one origin for both the website and /api, with client routes
// such as /auth and /shop falling back to Angular's index.html.
const frontendDirectory = path.join(__dirname, '..', 'frontend', 'dist', 'frontend', 'browser');
const frontendIndex = path.join(frontendDirectory, 'index.html');

if (fs.existsSync(frontendIndex)) {
  app.use(express.static(frontendDirectory));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(frontendIndex);
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
