// const express = require('express');
// const router = express.Router();
// const {
//   register,
//   login,
//   logout,
//   getCurrentUser,
// } = require('../controllers/authController.js');
// const { protect } = require('../middleware/auth.js');



import express from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/auth', login);
router.post('/logout', logout);
router.get('/me', protect, getCurrentUser);

export default router;
