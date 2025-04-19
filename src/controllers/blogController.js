const Blog = require('../models/blogModel');
const { successResponse, errorResponse } = require('../utils/response');

// Create blog
exports.createBlog = async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user._id,
    };

    let blog = await Blog.create(blogData);
    blog = await Blog.findOne({ _id: blog._id })
      .populate('author', 'firstName lastName email avatar')
      .lean();

    return successResponse(res, 'Blog created successfully', blog);
  } catch (error) {
    return errorResponse(res, 'Failed to create blog', error);
  }
};

// Get all published blog
exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, search } = req.query;
    const query = { status: 'published' };

    if (category) query.category = decodeURIComponent(category);
    if (tag) query.tags = { $in: [decodeURIComponent(tag)] };
    if (search) {
      const decodedSearch = decodeURIComponent(search);
      query.$or = [
        { title: { $regex: decodedSearch, $options: 'i' } }, // Search in title
        { content: { $regex: decodedSearch, $options: 'i' } }, // Search in content
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'firstName lastName email avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Blog.countDocuments(query);

    return successResponse(res, 'Blogs retrieved successfully', {
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve blogs', error);
  }
};

// Get user's blogs
exports.getUserBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, tag, search } = req.query; // Extract category and tag
    const query = { author: req.user._id };

    if (status) query.status = status;
    if (category) query.category = decodeURIComponent(category);
    if (tag) query.tags = { $in: [decodeURIComponent(tag)] };
    if (search) {
      const decodedSearch = decodeURIComponent(search);
      query.$or = [
        { title: { $regex: decodedSearch, $options: 'i' } }, // Search in title
        { content: { $regex: decodedSearch, $options: 'i' } }, // Search in content
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'firstName lastName email avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Blog.countDocuments(query);

    return successResponse(res, 'User blogs retrieved successfully', {
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res, 'Failed to retrieve user blogs', error);
  }
};

// Get blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'firstName lastName email avatar')
      .lean();

    if (!blog) {
      return errorResponse(res, 'Blog not found', null, 404);
    }

    return successResponse(res, 'Blog retrieved successfully', blog);
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve blog', error);
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    console.log(req.params.slug);
    const blog = await Blog.findOne({
      slug: req.params.slug,
      author: req.user._id,
    });

    if (!blog) {
      return errorResponse(res, 'Blog not found or unauthorized', null, 404);
    }
    delete req.body._id;
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: blog._id },
      req.body,
      { new: true }
    )
      .populate('author', 'firstName lastName email avatar')
      .lean();

    return successResponse(res, 'Blog updated successfully', updatedBlog);
  } catch (error) {
    return errorResponse(res, 'Failed to update blog', error);
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.slug,
      author: req.user._id,
    });

    if (!blog) {
      return errorResponse(res, 'Blog not found or unauthorized', null, 404);
    }

    await Blog.deleteOne({ _id: blog._id });
    return successResponse(res, 'Blog deleted successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to delete blog', error);
  }
};

// Like/Unlike blog
exports.toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return errorResponse(res, 'Blog not found', null, 404);
    }

    const userLiked = blog.likes.includes(req.user._id);
    const update = userLiked
      ? { $pull: { likes: req.user._id } }
      : { $addToSet: { likes: req.user._id } };

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, update, {
      new: true,
    })
      .populate('author', 'firstName lastName email avatar')
      .lean();

    return successResponse(
      res,
      userLiked ? 'Blog unliked successfully' : 'Blog liked successfully',
      updatedBlog
    );
  } catch (error) {
    return errorResponse(res, 'Failed to toggle like', error);
  }
};
