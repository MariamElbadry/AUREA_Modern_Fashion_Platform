require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path');
const app = require('./app');

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

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.error('If this is a querySrv DNS error, set DNS_SERVERS=1.1.1.1,8.8.8.8 or change the computer DNS settings.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
