const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const auth = require('../middleware/auth.middleware');

// GET /api/users/designers — returns all designers
router.get('/designers', auth, async (req, res) => {
  try {
    const designers = await User.find({ role: 'designer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(designers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;