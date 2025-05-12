// const Course = require('../models/courseModel');
// const { successResponse, errorResponse } = require('../utils/response');

// exports.createCourse = async (req, res) => {
//   try {
//     if (req.user.role !== 'recruiter') {
//       return errorResponse(res, 'Only recruiters can create courses', null, 403);
//     }
// delete req.body._id
//     const courseData = {
//       ...req.body,
//       createdBy: req.user._id
//     };

//     // Slug will be automatically generated in pre-save middleware
//     let course = await Course.create(courseData);
//      course = await Course.findOne({_id:course._id}).populate('createdBy', 'fullName email').lean();
//     return successResponse(res, 'Course created successfully', course);
//   } catch (error) {
//     console.error('Course creation error:', error);
//     return errorResponse(res, 'Failed to create course', error);
//   }
// };

// exports.updateCourse = async (req, res) => {
//   try {
//     delete req.body._id
//     const course = await Course.findOne(
//       { slug: req.params.id }
//     ).lean();
    
//     if (!course) {
//       return errorResponse(res, 'Course not found', null, 404);
//     }

//     if (course.createdBy.toString() !== req.user._id.toString()) {
//       return errorResponse(res, 'Not authorized to update this course', null, 403);
//     }

//     // Slug will be automatically updated in pre-findOneAndUpdate middleware
//     const updatedCourse = await Course.findOneAndUpdate(
//       { _id: course._id },
//       req.body,
//       { 
//         new: true, 
//         runValidators: true 
//       }
//     ).populate('createdBy', 'fullName email').lean();

//     return successResponse(res, 'Course updated successfully', updatedCourse);
//   } catch (error) {
//     console.error('Course update error:', error);
//     return errorResponse(res, 'Failed to update course', error);
//   }
// };

// // Get all courses
// exports.getAllCourses = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, type, level, search } = req.query;
//     const query = {};

//     if (type) query.type = type;
//     if (level) query.level = level;
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const courses = await Course.find(query)
//       .populate('createdBy', 'fullName email')
//       .sort({ createdAt: -1 })
//       .limit((Number(limit)||10) * 1)
//       .skip(((Number(page)||1) - 1) * (Number(limit)||10))
//       .lean();

//     const total = await Course.countDocuments(query);

//     return successResponse(res, 'Courses retrieved successfully', {
//       courses,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total
//     });
//   } catch (error) {
//     return errorResponse(res, 'Failed to retrieve courses', error);
//   }
// };
// exports.getAllMyCourses = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, type, level, search } = req.query;
//     const query = {};

//     if (type) query.type = type;
//     if (level) query.level = level;
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } }
//       ];
//     }

//     query.createdBy = req.user._id

//     const courses = await Course.find(query)
//       .populate('createdBy', 'fullName email')
//       .sort({ createdAt: -1 })
//       .limit((Number(limit)||10) * 1)
//       .skip(((Number(page)||1) - 1) * (Number(limit)||10))
//       .lean();

//     const total = await Course.countDocuments(query);

//     return successResponse(res, 'Courses retrieved successfully', {
//       courses,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total
//     });
//   } catch (error) {
//     return errorResponse(res, 'Failed to retrieve courses', error);
//   }
// };

// // Get recruiter's courses
// exports.getRecruiterCourses = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;

//     const courses = await Course.find({ createdBy: req.user._id }).populate('createdBy', 'fullName email')
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit).lean();

//     const total = await Course.countDocuments({ createdBy: req.user._id });

//     return successResponse(res, 'Recruiter courses retrieved successfully', {
//       courses,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total
//     });
//   } catch (error) {
//     return errorResponse(res, 'Failed to retrieve recruiter courses', error);
//   }
// };

// // Get course by ID
// exports.getCourse = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id)
//       .populate('createdBy', 'fullName email').lean();
    
//     if (!course) {
//       return errorResponse(res, 'Course not found', null, 404);
//     }
    
//     return successResponse(res, 'Course retrieved successfully', course);
//   } catch (error) {
//     return errorResponse(res, 'Failed to retrieve course', error);
//   }
// };

// // Get course by slug
// exports.getCourseBySlug = async (req, res) => {
//   try {
//     const course = await Course.findOne({ slug: req.params.slug })
//       .populate('createdBy', 'fullName email').lean();
    
//     if (!course) {
//       return errorResponse(res, 'Course not found', null, 404);
//     }
    
//     return successResponse(res, 'Course retrieved successfully', course);
//   } catch (error) {
//     return errorResponse(res, 'Failed to retrieve course', error);
//   }
// };

// // Delete course
// exports.deleteCourse = async (req, res) => {
//   try {
//     const course = await Course.findOne({ 
//       $or: [
//         { _id: req.params.id },
//         { slug: req.params.id }
//       ]
//     }).lean();
    
//     if (!course) {
//       return errorResponse(res, 'Course not found', null, 404);
//     }

//     if (course.createdBy.toString() !== req.user._id.toString()) {
//       return errorResponse(res, 'Not authorized to delete this course', null, 403);
//     }

//     await Course.deleteOne({ _id: course._id });
//     return successResponse(res, 'Course deleted successfully', null);
//   } catch (error) {
//     return errorResponse(res, 'Failed to delete course', error);
//   }
// };




import Course from '../models/courseModel.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Create a new course
export const createCourse = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return errorResponse(res, 'Only recruiters can create courses', null, 403);
    }

    delete req.body._id;

    const courseData = {
      ...req.body,
      createdBy: req.user._id
    };

    let course = await Course.create(courseData);
    course = await Course.findOne({ _id: course._id })
      .populate('createdBy', 'fullName email')
      .lean();

    return successResponse(res, 'Course created successfully', course);
  } catch (error) {
    console.error('Course creation error:', error);
    return errorResponse(res, 'Failed to create course', error);
  }
};

// Update an existing course
export const updateCourse = async (req, res) => {
  try {
    delete req.body._id;

    const course = await Course.findOne({ slug: req.params.id }).lean();
    if (!course) {
      return errorResponse(res, 'Course not found', null, 404);
    }

    if (course.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to update this course', null, 403);
    }

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: course._id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'fullName email').lean();

    return successResponse(res, 'Course updated successfully', updatedCourse);
  } catch (error) {
    console.error('Course update error:', error);
    return errorResponse(res, 'Failed to update course', error);
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, level, search } = req.query;
    const query = {};

    if (type) query.type = type;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Course.countDocuments(query);

    return successResponse(res, 'Courses retrieved successfully', {
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve courses', error);
  }
};

// Get current user's courses
export const getAllMyCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, level, search } = req.query;
    const query = { createdBy: req.user._id };

    if (type) query.type = type;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Course.countDocuments(query);

    return successResponse(res, 'Courses retrieved successfully', {
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve courses', error);
  }
};

// Get recruiter's courses
export const getRecruiterCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const courses = await Course.find({ createdBy: req.user._id })
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Course.countDocuments({ createdBy: req.user._id });

    return successResponse(res, 'Recruiter courses retrieved successfully', {
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve recruiter courses', error);
  }
};

// Get course by ID
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'fullName email')
      .lean();

    if (!course) {
      return errorResponse(res, 'Course not found', null, 404);
    }

    return successResponse(res, 'Course retrieved successfully', course);
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve course', error);
  }
};

// Get course by slug
export const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('createdBy', 'fullName email')
      .lean();

    if (!course) {
      return errorResponse(res, 'Course not found', null, 404);
    }

    return successResponse(res, 'Course retrieved successfully', course);
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve course', error);
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }]
    }).lean();

    if (!course) {
      return errorResponse(res, 'Course not found', null, 404);
    }

    if (course.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to delete this course', null, 403);
    }

    await Course.deleteOne({ _id: course._id });
    return successResponse(res, 'Course deleted successfully', null);
  } catch (error) {
    return errorResponse(res, 'Failed to delete course', error);
  }
};
