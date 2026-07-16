const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register customer or designer (admin cannot be registered publicly)
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Validate role - only allow 'customer' or 'designer'
    const validRoles = ['customer', 'designer'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Only customer and designer can register.' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'customer'
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login for all roles (admin, customer, designer)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all designers
const getDesigners = async (req, res) => {
  try {
    const designers = await User.find({ role: 'designer' }).select('-password');
    res.json(designers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {register, login, getDesigners};
