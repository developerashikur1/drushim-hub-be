// const Review = require('../models/reviewModel');
// const Purchase = require('../models/purchaseModel');
// const { successResponse, errorResponse } = require('../utils/response');

// // Create review
// exports.createReview = async (req, res) => {
//   try {
//     // Check if user has purchased the course
//     const purchase = await Purchase.findOne({
//       course: req.params.courseId,
//       user: req.user._id,
//       paymentStatus: 'completed'
//     });

//     if (!purchase) {
//       return errorResponse(res, 'You must purchase this course to review it', null, 403);
//     }

//     // Check if user has already reviewed
//     const existingReview = await Review.findOne({
//       course: req.params.courseId,
//       user: req.user._id
//     });

//     if (existingReview) {
//       return errorResponse(res, 'You have already reviewed this course', null, 400);
//     }

//     const review = await Review.create({
//       course: req.params.courseId,
//       user: req.user._id,
//       rating: req.body.rating,
//       review: req.body.review
//     });

//     const populatedReview = await Review.findById(review._id)
//       .populate('user', 'firstName lastName email avatar')
//       .lean();

//     return successResponse(res, 'Review created successfully', populatedReview);
//   } catch (error) {
//     return errorResponse(res, 'Failed to create review', error);
//   }
// };

// // Get course reviews
// exports.getCourseReviews = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
    
//     const reviews = await Review.find({ course: req.params.courseId })
//       .populate('user', 'firstName lastName email avatar')
//       .sort({ createdAt: -1 })
//       .limit(Number(limit))
//       .skip((Number(page) - 1) * Number(limit))
//       .lean();

//     const total = await Review.countDocuments({ course: req.params.courseId });

//     return successResponse(res, 'Reviews retrieved successfully', {
//       reviews,
//       totalPages: Math.ceil(total / limit),
//       currentPage: Number(page),
//       total
//     });
//   } catch (error) {
//     return errorResponse(res, 'Failed to retrieve reviews', error);
//   }
// };

// // Update review
// exports.updateReview = async (req, res) => {
//   try {
//     const review = await Review.findOne({
//       _id: req.params.id,
//       user: req.user._id
//     });

//     if (!review) {
//       return errorResponse(res, 'Review not found or unauthorized', null, 404);
//     }

//     const updatedReview = await Review.findByIdAndUpdate(
//       req.params.id,
//       {
//         rating: req.body.rating,
//         review: req.body.review
//       },
//       { new: true }
//     ).populate('user', 'firstName lastName email avatar')
//     .lean();

//     return successResponse(res, 'Review updated successfully', updatedReview);
//   } catch (error) {
//     return errorResponse(res, 'Failed to update review', error);
//   }
// };

// // Delete review
// exports.deleteReview = async (req, res) => {
//   try {
//     const review = await Review.findOne({
//       _id: req.params.id,
//       user: req.user._id
//     });

//     if (!review) {
//       return errorResponse(res, 'Review not found or unauthorized', null, 404);
//     }

//     await review.remove();
//     return successResponse(res, 'Review deleted successfully');
//   } catch (error) {
//     return errorResponse(res, 'Failed to delete review', error);
//   }
// };


import Review from '../models/reviewModel.js';
import Purchase from '../models/purchaseModel.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Create review
export const createReview = async (req, res) => {
  try {
    // Check if user has purchased the course
    const purchase = await Purchase.findOne({
      course: req.params.courseId,
      user: req.user._id,
      paymentStatus: 'completed'
    });

    if (!purchase) {
      return errorResponse(res, 'You must purchase this course to review it', null, 403);
    }

    // Check if user has already reviewed
    const existingReview = await Review.findOne({
      course: req.params.courseId,
      user: req.user._id
    });

    if (existingReview) {
      return errorResponse(res, 'You have already reviewed this course', null, 400);
    }

    const review = await Review.create({
      course: req.params.courseId,
      user: req.user._id,
      rating: req.body.rating,
      review: req.body.review
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'firstName lastName email avatar')
      .lean();

    return successResponse(res, 'Review created successfully', populatedReview);
  } catch (error) {
    return errorResponse(res, 'Failed to create review', error);
  }
};

// Get course reviews
export const getCourseReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ course: req.params.courseId })
      .populate('user', 'firstName lastName email avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Review.countDocuments({ course: req.params.courseId });

    return successResponse(res, 'Reviews retrieved successfully', {
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve reviews', error);
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!review) {
      return errorResponse(res, 'Review not found or unauthorized', null, 404);
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      {
        rating: req.body.rating,
        review: req.body.review
      },
      { new: true }
    )
      .populate('user', 'firstName lastName email avatar')
      .lean();

    return successResponse(res, 'Review updated successfully', updatedReview);
  } catch (error) {
    return errorResponse(res, 'Failed to update review', error);
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!review) {
      return errorResponse(res, 'Review not found or unauthorized', null, 404);
    }

    await review.remove();
    return successResponse(res, 'Review deleted successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to delete review', error);
  }
};
