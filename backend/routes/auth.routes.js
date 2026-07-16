const express = require('express');
const router = express.Router();
const { register, login, getDesigners } = require('../controllers/auth.controller');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/designers', getDesigners);

module.exports = router;
