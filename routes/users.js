const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create a new user
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    
    // Log incoming request
    console.log('Register request received:', { first_name, last_name, email });

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({ error: 'This email is already registered' });
    }

    const newUser = new User({ first_name, last_name, email, password });
    await newUser.save();
    console.log('New user registered:', newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign-in a user
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(404).json({ error: 'User not registered' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
