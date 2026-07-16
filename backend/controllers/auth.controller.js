const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register customer or designer (admin cannot be registered publicly)
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Validate email format and normalize to lowercase
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    const normalizedEmail = email.toLowerCase();

    // Validate password strength
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Public registration only allows customer role
    // Designer role requires admin approval
    if (role && role !== 'customer') {
      return res.status(400).json({ message: 'Public registration only allows customer role. Designer role requires admin approval.' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user (always customer for public registration)
    const user = new User({
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'customer'
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

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Find user
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
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
