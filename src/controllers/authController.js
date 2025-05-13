// const User = require('../models/User.js');
// const jwt = require('jsonwebtoken');
// const { successResponse, errorResponse } = require('../utils/response.js');

// // Helper function to create JWT token
// const createToken = (user) => {
//   return jwt.sign(
//     { id: user._id, email: user.email, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: '1d' }
//   );
// };

// // Helper function for consistent cookie settings
// const getCookieOptions = () => {
//   const isProduction = process.env.NODE_ENV === 'production';
//   return {
//     httpOnly: true,
//     secure: isProduction, // Use secure cookies in production
//     sameSite: isProduction ? 'none' : 'lax', // Adjust sameSite based on environment
//     path: '/',
//     maxAge: 24 * 60 * 60 * 1000, // 1 day
//     domain: isProduction ? 'your-production-domain.com' : 'localhost', // Use appropriate domain
//   };
// };

// // Register new user
// exports.register = async (req, res) => {
//   try {
//     console.log('Registration attempt:', req.body);
//     const { email, password, role } = req.body;

//     if (!email || !password || !role) {
//       console.log('Missing required fields:', {
//         email: !!email,
//         password: !!password,
//         role: !!role,
//       });
//       return errorResponse(res, 'Email, password, and role are required');
//     }

//     // Validate role
//     if (!['candidate', 'recruiter'].includes(role)) {
//       return errorResponse(res, 'Invalid role specified');
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     console.log(
//       'Existing user check:',
//       existingUser ? 'User exists' : 'New user'
//     );

//     if (existingUser) {
//       return errorResponse(res, 'Email already registered');
//     }
//     console.log({ email, password, role });

//     // Create new user
//     const user = new User({ email, password, role });
//     try {
//       await user.save();
//       console.log('New user created:', {
//         email: user.email,
//         id: user._id,
//         role: user.role,
//       });
//     } catch (saveError) {
//       console.error('Error saving user:', saveError);
//       return errorResponse(res, 'Error saving user', saveError);
//     }

//     // Create token
//     const token = createToken(user);
//     console.log('Token created for user:', user.email);

//     // Set cookie
//     res.cookie('token', token, getCookieOptions());
//     console.log('Cookie set successfully');

//     return successResponse(res, 'Registration successful', {
//       token:token,
//       user: {
//         id: user._id,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error('Registration error details:', {
//       error: error.message,
//       stack: error.stack,
//       body: req.body,
//     });
//     return errorResponse(res, 'Error registering user', error);
//   }
// };

// // Login user
// exports.login = async (req, res) => {
//   try {
//     console.log('Login attempt:', req.body);
//     const { email, password } = req.body;

//     // Find user and explicitly select password
//     const user = await User.findOne({ email }).select('+password');
//     console.log('Found user:', user ? 'Yes' : 'No');

//     if (!user) {
//       return errorResponse(res, 'Invalid credentials');
//     }

//     // Check password
//     const isMatch = await user.comparePassword(password);
//     console.log('Password match:', isMatch ? 'Yes' : 'No');

//     if (!isMatch) {
//       return errorResponse(res, 'Invalid credentials');
//     }

//     // Create token
//     const token = createToken(user);

//     // Set cookie
//     res.cookie('token', token, getCookieOptions());

//     console.log('Login successful for:', email);

//     return successResponse(res, 'Login successful', {
//       token: token,
//       user: {
//         id: user._id,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     return errorResponse(res, 'Error logging in', error);
//   }
// };

// // Logout user
// exports.logout = (req, res) => {
//   console.log('Logout request received');

//   // Clear the token cookie with same options (except maxAge)
//   const options = {
//     ...getCookieOptions(),
//     maxAge: 0, // Immediate expiration
//   };

//   res.cookie('token', '', options);

//   console.log('Cookie cleared, sending response');
//   return successResponse(res, 'Logged out successfully');
// };

// // Get current user
// exports.getCurrentUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) {
//       return errorResponse(res, 'User not found');
//     }
//     successResponse(res, 'User retrieved successfully', user);
//   } catch (error) {
//     console.error('Get current user error:', error);
//     return errorResponse(res, 'Error getting user data', error);
//   }
// };



import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse } from '../utils/response.js';

// Helper function to create JWT token
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Helper function for consistent cookie settings
// const getCookieOptions = () => {
// //   const isProduction = process.env.NODE_ENV === 'production';
//   return {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'none',
//     path: '/',
//     maxAge: 24 * 60 * 60 * 1000,
//     // domain: isProduction ? 'https://drushim-hub.netlify.app' : 'localhost',
//     // httpOnly: true,
//     // secure: isProduction,
//     // sameSite: isProduction ? 'none' : 'lax',
//     // path: '/',
//     // maxAge: 24 * 60 * 60 * 1000,
//     // domain: isProduction ? 'https://drushim-hub.netlify.app' : 'localhost',
//   };
// };

const getCookieOptions = () => {
//   const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: true, // Required for HTTPS
    sameSite: 'none', // Required for cross-origin
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    // domain: '.onrender.com', // Update with your domain
  };
};

// Register new user
const register = async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      console.log('Missing required fields:', {
        email: !!email,
        password: !!password,
        role: !!role,
      });
      return errorResponse(res, 'Email, password, and role are required');
    }

    if (!['candidate', 'recruiter'].includes(role)) {
      return errorResponse(res, 'Invalid role specified');
    }

    const existingUser = await User.findOne({ email });
    console.log(
      'Existing user check:',
      existingUser ? 'User exists' : 'New user'
    );

    if (existingUser) {
      return errorResponse(res, 'Email already registered');
    }

    console.log({ email, password, role });

    const user = new User({ email, password, role });

    try {
      await user.save();
      console.log('New user created:', {
        email: user.email,
        id: user._id,
        role: user.role,
      });
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      return errorResponse(res, 'Error saving user', saveError);
    }

    const token = createToken(user);
    console.log('Token created for user:', user.email);

    res.cookie('token', token, getCookieOptions());
    console.log('Cookie set successfully');

    return successResponse(res, 'Registration successful', {
      token: token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error details:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
    });
    return errorResponse(res, 'Error registering user', error);
  }
};

// Login user
const login = async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    console.log('Found user:', user ? 'Yes' : 'No');

    if (!user) {
      return errorResponse(res, 'Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');

    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials');
    }

    const token = createToken(user);

    res.cookie('token', token, getCookieOptions());

    console.log('Login successful for:', email);

    return successResponse(res, 'Login successful', {
      token: token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Error logging in', error);
  }
};

// Logout user
const logout = (req, res) => {
  console.log('Logout request received');

  const options = {
    ...getCookieOptions(),
    maxAge: 0,
  };

  res.cookie('token', '', options);

  console.log('Cookie cleared, sending response');
  return successResponse(res, 'Logged out successfully');
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return errorResponse(res, 'User not found');
    }
    successResponse(res, 'User retrieved successfully', user);
  } catch (error) {
    console.error('Get current user error:', error);
    return errorResponse(res, 'Error getting user data', error);
  }
};

export {
  register,
  login,
  logout,
  getCurrentUser
};
