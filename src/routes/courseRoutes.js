const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  createCourse,
  getAllCourses,
  getRecruiterCourses,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  getAllMyCourses,
} = require('../controllers/courseController');

const {
  createReview,
  getCourseReviews,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

// Public routes
router.get('/', getAllCourses);
router.get('/my/courses', protect, getAllMyCourses);
router.get('/by-slug/:slug', getCourseBySlug);
router.get('/:courseId/reviews', getCourseReviews);

// Protected routes - Apply protect middleware to specific routes instead of using router.use
router.post('/:courseId/reviews', protect, createReview);
router.put('/reviews/:id', protect, updateReview);
router.delete('/reviews/:id', protect, deleteReview);

// Recruiter routes
router.post('/', protect, restrictTo('recruiter'), createCourse);
router.get(
  '/recruiter/courses',
  protect,
  restrictTo('recruiter'),
  getRecruiterCourses
);
router.put('/:id', protect, restrictTo('recruiter'), updateCourse);
router.delete('/:id', protect, restrictTo('recruiter'), deleteCourse);

module.exports = router;
