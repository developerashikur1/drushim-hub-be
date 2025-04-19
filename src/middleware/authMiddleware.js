const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');

exports.protect = async (req, res, next) => {
  try {
    // console.log('Authorization Header:', req.headers.authorization);

    // Extract token from cookies or authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];


    if (!token) {
      return errorResponse(res, 'Not authorized - No token', null, 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found', null, 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Not authorized - Invalid token', error, 401);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'You do not have permission to perform this action', null, 403);
    }
    next();
  };
};
