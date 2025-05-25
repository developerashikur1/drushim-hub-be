// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { errorResponse } = require('../utils/response.js');

// exports.protect = async (req, res, next) => {
//   try {
//     const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
// console.log(token,"token")
//     if (!token) {
//       return errorResponse(res, 'Not authorized - No token', null, 401);
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id).select('-password');
//     // console.log(user,"user")
//     if (!user) {
//       return errorResponse(res, 'User not found', null, 401);
//     }
  

//     req.user = user;
//     next();
//   } catch (error) {
//     return errorResponse(res, 'Not authorized - Invalid token', error, 401);
//   }
// };

// exports.admin = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     return errorResponse(res, 'Not authorized as admin', null, 403);
//   }
// };

// exports.hasRole = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (req.user && allowedRoles.includes(req.user.role)) {
//       return next();
//     }
//     return errorResponse(res, 'Access Denied', {
//       message: `Current Role: ${req.user ? req.user.role : 'Guest'}. Required Roles: ${allowedRoles.join(', ')}.`
//     }, 403);
//   };
// };


import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/response.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log(token, "token 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨");

    if (!token) {
      return errorResponse(res, 'Not authorized - No token', null, 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    // console.log(user, "user");
    if (!user) {
      return errorResponse(res, 'User not found', null, 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Not authorized - Invalid token', error, 401);
  }
};

export const protectOrAccess = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        req.user = null;
        next();
        return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    req.user = user ? user : null;
    next();
  } catch (error) {
    return errorResponse(res, 'Not authorized - Invalid token', error, 401);
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return errorResponse(res, 'Not authorized as admin', null, 403);
  }
};

export const hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      return next();
    }
    return errorResponse(res, 'Access Denied', {
      message: `Current Role: ${req.user ? req.user.role : 'Guest'}. Required Roles: ${allowedRoles.join(', ')}.`
    }, 403);
  };
};
