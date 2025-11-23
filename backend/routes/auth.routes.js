const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
require('dotenv').config();

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { displayName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Create and save the new user
    const newUser = new User({ displayName, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

// @desc    Log in a user with email and password
// @route   POST /api/auth/login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Login failed',
        user: user
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      // Generate a JWT
      const payload = { id: user.id, displayName: user.displayName , email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

      return res.json({ token: `Bearer ${token}` });
    });
  })(req, res);
});


// @desc    Authenticate with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: process.env.FRONTEND_URL, // Redirect to your frontend login page on failure
  session: false
}),
(req, res) => {
  // On successful authentication, req.user is available.
  // Generate JWT for the user provided by Google
  const payload = { id: req.user.id, displayName: req.user.displayName, email: req.user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

  // Redirect user back to the frontend, passing the token as a URL parameter
  res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=Bearer%20${token}`);
});

module.exports = router;

