const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createBlog,
  getAllBlogs,
  getUserBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  toggleLike
} = require('../controllers/blogController');

// Public routes
router.get('/', getAllBlogs);
router.get('/by-slug/:slug', getBlogBySlug);

// Protected routes
router.use(protect);

// User blog routes
router.post('/create', createBlog);
router.get('/my-blogs', getUserBlogs);
router.put('/:slug', updateBlog);
router.delete('/:slug', deleteBlog);
router.post('/:id/like', toggleLike);

module.exports = router;