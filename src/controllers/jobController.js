// const Job = require('../models/Job.js');
// const { successResponse, errorResponse } = require('../utils/response.js');
// const { generateText } = require('ai');
// const { openai } = require('@ai-sdk/openai');
// const { generateJobPost } = require('../utils/func.js');

// // Create a new job
// exports.createJob = async (req, res) => {
//   try {

//     const job = new Job({ ...req.body, userId: req.user.id });
//     await job.save();
//     return successResponse(res, 'Job created successfully', job);
//   } catch (error) {
//     return errorResponse(res, 'Failed to create job', error);
//   }
// };

// exports.createJobPost = async (req, res) => {
//     try {
//         const { description } = req.body;

//         if (!description) {
//             return errorResponse(res, 'Job description is required');
//         }

//         // Generate AI job post
//         const jobPost = await generateJobPost(description);

//         // await job.save();
//         return successResponse(res, 'Job post created successfully', jobPost);

//     } catch (error) {
//         console.error('Error in createJobPost:', error);
//         return errorResponse(res, 'Failed to create job post', error);
//     }
// };

// // Update a job
// exports.updateJob = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const job = await Job.findByIdAndUpdate(id, req.body, { new: true });
//     if (!job) {
//       return errorResponse(res, 'Job not found');
//     }
//     return successResponse(res, 'Job updated successfully', job);
//   } catch (error) {
//     return errorResponse(res, 'Failed to update job', error);
//   }
// };

// // Delete a job
// exports.deleteJob = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const job = await Job.findByIdAndDelete(id);
//     if (!job) {
//       return errorResponse(res, 'Job not found');
//     }
//     return successResponse(res, 'Job deleted successfully');
//   } catch (error) {
//     return errorResponse(res, 'Failed to delete job', error);
//   }
// };

// // Get a single job by ID
// exports.getJobById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const job = await Job.findById(id);
//     if (!job) {
//       return errorResponse(res, 'Job not found');
//     }
//     return successResponse(res, 'Job retrieved successfully', job);
//   } catch (error) {
//     return errorResponse(res, 'Failed to retrieve job', error);
//   }
// };

// exports.getAllJobs = async (req, res) => {

//   try {

//     const { page = 1, limit = 10, q, company, location, type, salary, benefits, skills, remote, userId } = req.query;
//     const query = {};

//     if (q) {
//       query.title = { $regex: q, $options: 'i' };
//     }

//     if (company) {
//       query.company = { $regex: company, $options: 'i' };
//     }
//     if (location) {
//       query.location = { $regex: location, $options: 'i' };
//     }
//     if (type) {
//       query.type = { $regex: type, $options: 'i' };
//     }
//     if (salary) {
//       query.salary = { $regex: salary, $options: 'i' };
//     }
//     // if (benefits) {
//     //   query.benefits = { $in: benefits.split(',').filter(Boolean) };
//     // }
//     if (remote !== undefined) {
//       query.remote = remote === 'true';
//     }
//     if (userId) {
//       query.userId = userId;
//     }
//     // if (skills) {
//     //   query.skills = { $in: skills.split(',').filter(Boolean) };
//     // }
//     console.log("hitted jobs", req.query)
//     const jobs = await Job.find(query)
//       .limit(limit * 1)
//       .skip((page - 1) * limit).lean()
//     const count = await Job.countDocuments(query);

//     return successResponse(res, 'Jobs retrieved successfully', {
//       jobs: jobs || [],
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//     });
//   } catch (error) {
//     return errorResponse(res, 'Failed to retrieve jobs', error);
//   }
// }
// exports.getAllMyJobs = async (req, res) => {

//   try {
//     const { page = 1, limit = 10, q, company, location, type, salary, benefits, skills, remote } = req.query;
//     const query = {};

//     if (q) {
//       query.title = { $regex: q, $options: 'i' };
//     }

//     if (company) {
//       query.company = { $regex: company, $options: 'i' };
//     }
//     if (location) {
//       query.location = { $regex: location, $options: 'i' };
//     }
//     if (type) {
//       query.type = { $regex: type, $options: 'i' };
//     }
//     if (salary) {
//       query.salary = { $regex: salary, $options: 'i' };
//     }
//     if (benefits) {
//       query.benefits = { $in: benefits.split(',') };
//     }
//     query.userId = req.user.id;
//     if (skills) {
//       query.skills = { $in: skills.split(',') };
//     }

//     if (remote !== undefined) {
//       query.remote = remote === 'true';
//     }
//     const jobs = await Job.find(query)
//       .limit(limit * 1)
//       .skip((page - 1) * limit).lean()
//     const count = await Job.countDocuments(query);

//     return successResponse(res, 'My jobs retrieved successfully', {
//       jobs,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//     });
//   } catch (error) {
//     return errorResponse(res, 'Failed to retrieve my jobs', error);
//   }

// }

import Job from '../models/Job.js';
import { generateJobPost } from '../utils/func.js';
import { errorResponse, successResponse } from '../utils/response.js';

// Create a new job
export const createJob = async (req, res) => {
    
  try {
    console.log("my job creation, 🚨🚨🚨🚨 ", req.user.id, )
    const job = new Job({ ...req.body, userId: req.user.id });
    await job.save();
    return successResponse(res, 'Job created successfully', job);
  } catch (error) {
    return errorResponse(res, 'Failed to create job', error);
  }
};

export const createJobPost = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return errorResponse(res, 'Job description is required');
    }

    const jobPost = await generateJobPost(description);
    return successResponse(res, 'Job post created successfully', jobPost);
  } catch (error) {
    console.error('Error in createJobPost:', error);
    return errorResponse(res, 'Failed to create job post', error);
  }
};

// Update a job
export const updateJob = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findByIdAndUpdate(id, req.body, { new: true });
    if (!job) {
      return errorResponse(res, 'Job not found');
    }
    return successResponse(res, 'Job updated successfully', job);
  } catch (error) {
    return errorResponse(res, 'Failed to update job', error);
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return errorResponse(res, 'Job not found');
    }
    return successResponse(res, 'Job deleted successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to delete job', error);
  }
};

// Get a single job by ID
export const getJobById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const job = await Job.findById(id);
    if (!job) {
      return errorResponse(res, 'Job not found');
    }
    return successResponse(res, 'Job retrieved successfully', job);
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve job', error);
  }
};

// Get all jobs (with filters and pagination)
export const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 100,
      q,
      company,
      location,
      type,
      salary,
      remote,
      userId: userIds,
    } = req.query;

    // const userId = req?.user?.id || userIds || "68065e7e5495908f9043ac7a"
    const userId = req?.user?.id || userIds;

console.log("hitted jobs ============= ✅", userId)

    const query = {};
    const sort = { createdAt: -1 };

    if (q) query.title = { $regex: q, $options: 'i' };
    if (company) query.company = { $regex: company, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = { $regex: type, $options: 'i' };
    if (salary) query.salary = { $regex: salary, $options: 'i' };
    if (remote !== undefined) query.remote = remote === 'true';
    if (userId) query.userId = userId;

    const jobs = await Job.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Job.countDocuments(query);

    return successResponse(res, 'Jobs retrieved successfully', {
      jobs: jobs || [],
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve jobs', error);
  }
};

// Get all jobs created by the logged-in user
export const getAllMyJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      q,
      company,
      location,
      type,
      salary,
      benefits,
      skills,
      remote,
    } = req.query;

    const query = {
      userId: req.user.id,
    };

    if (q) query.title = { $regex: q, $options: 'i' };
    if (company) query.company = { $regex: company, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = { $regex: type, $options: 'i' };
    if (salary) query.salary = { $regex: salary, $options: 'i' };
    if (benefits) query.benefits = { $in: benefits.split(',') };
    if (skills) query.skills = { $in: skills.split(',') };
    if (remote !== undefined) query.remote = remote === 'true';

    const jobs = await Job.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Job.countDocuments(query);

    return successResponse(res, 'My jobs retrieved successfully', {
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve my jobs', error);
  }
};
