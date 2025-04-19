const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getCurrentUser,
} = require('../controllers/authController.js');
const { protect } = require('../middleware/auth.js');

// Auth routes
router.post('/register', register);
router.post('/auth', login);
router.post('/logout', logout);
router.get('/me', protect, getCurrentUser);

module.exports = router;
