const express = require('express');
const router = express.Router();
const { register, login, getDesigners } = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes with rate limiting
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/designers', getDesigners);

module.exports = router;
