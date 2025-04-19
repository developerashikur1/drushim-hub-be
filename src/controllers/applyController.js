// const JobApplication = require('../models/apply.js');
// const mongoose = require('mongoose');
// const path = require('path');
// const { successResponse, errorResponse } = require('../utils/response.js');

// exports.applyForJob = async (req, res) => {
//   try {
//     const { jobId, fullName, email, resume, phone, additionalNotes } = req.body;

//     if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
//       return errorResponse(res, 'Invalid or missing jobId');
//     }
//     if (!fullName || fullName.trim().length < 3) {
//       return errorResponse(res, 'Full name must be at least 3 characters long');
//     }
//     if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
//       return errorResponse(res, 'Invalid email format');
//     }
//     if (!phone) {
//       return errorResponse(res, 'Phone number is required!');
//     }
//     if (!resume) {
//       return errorResponse(res, 'Resume file is required');
//     }

//     const alreadyApplied = await JobApplication.findOne({
//       jobId: jobId,
//       email: email,
//     }).lean();
//     if (alreadyApplied?._id) {
//       return errorResponse(res, 'This job already applied');
//     }
//     let newApplication = new JobApplication({
//       jobId,
//       fullName,
//       email,
//       phone,
//       resume,
//       additionalNotes,
//     });

//     await newApplication.save();
//     newApplication = await JobApplication.findOne({
//       _id: newApplication?._id,
//     }).populate('jobId', 'title');

//     return successResponse(
//       res,
//       'Job application submitted successfully',
//       newApplication
//     );
//   } catch (error) {
//     return errorResponse(res, 'Server Error', error);
//   }
// };

// exports.getAllApplications = async (req, res) => {
//   try {
//     let { page = 1, email, limit = 10 } = req.query;
//     page = parseInt(page);
//     limit = parseInt(limit);

//     let filter = {};

//     if (email && email !== '') {
//       filter.email = email;
//     }
//     const applications = await JobApplication.find(filter)
//       .populate('jobId', 'title')
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const total = await JobApplication.countDocuments(filter);

//     return successResponse(res, 'Job applications fetched successfully', {
//       applications,
//       total,
//       page,
//       limit,
//     });
//   } catch (error) {
//     return errorResponse(res, 'Server Error', error);
//   }
// };

// exports.getApplicationsByUser = async (req, res) => {
//   try {
//     const { email } = req.params;
//     let { page = 1, limit = 10 } = req.query;
//     page = parseInt(page);
//     limit = parseInt(limit);

//     const applications = await JobApplication.find({ email: email })
//       .populate('jobId', 'title')
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const total = await JobApplication.countDocuments({ email: email });

//     return successResponse(res, 'User job applications fetched successfully', {
//       applications,
//       total,
//       page,
//       limit,
//     });
//   } catch (error) {
//     return errorResponse(res, 'Server Error', error);
//   }
// };

// exports.getApplicationById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return errorResponse(res, 'Invalid application ID');
//     }

//     const application = await JobApplication.findById(id).populate(
//       'jobId',
//       'title'
//     );

//     if (!application) {
//       return errorResponse(res, 'Application not found');
//     }

//     return successResponse(
//       res,
//       'Job application fetched successfully',
//       application
//     );
//   } catch (error) {
//     return errorResponse(res, 'Server Error', error);
//   }
// };



import mongoose from 'mongoose';
import path from 'path';
import JobApplication from '../models/apply.js';
import { successResponse, errorResponse } from '../utils/response.js';

const applyForJob = async (req, res) => {
  try {
    const { jobId, fullName, email, resume, phone, additionalNotes } = req.body;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return errorResponse(res, 'Invalid or missing jobId');
    }
    if (!fullName || fullName.trim().length < 3) {
      return errorResponse(res, 'Full name must be at least 3 characters long');
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return errorResponse(res, 'Invalid email format');
    }
    if (!phone) {
      return errorResponse(res, 'Phone number is required!');
    }
    if (!resume) {
      return errorResponse(res, 'Resume file is required');
    }

    const alreadyApplied = await JobApplication.findOne({
      jobId: jobId,
      email: email,
    }).lean();
    if (alreadyApplied?._id) {
      return errorResponse(res, 'This job already applied');
    }

    let newApplication = new JobApplication({
      jobId,
      fullName,
      email,
      phone,
      resume,
      additionalNotes,
    });

    await newApplication.save();

    newApplication = await JobApplication.findOne({
      _id: newApplication?._id,
    }).populate('jobId', 'title');

    return successResponse(
      res,
      'Job application submitted successfully',
      newApplication
    );
  } catch (error) {
    return errorResponse(res, 'Server Error', error);
  }
};

const getAllApplications = async (req, res) => {
  try {
    let { page = 1, email, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let filter = {};
    if (email && email !== '') {
      filter.email = email;
    }

    const applications = await JobApplication.find(filter)
      .populate('jobId', 'title')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await JobApplication.countDocuments(filter);

    return successResponse(res, 'Job applications fetched successfully', {
      applications,
      total,
      page,
      limit,
    });
  } catch (error) {
    return errorResponse(res, 'Server Error', error);
  }
};

const getApplicationsByUser = async (req, res) => {
  try {
    const { email } = req.params;
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const applications = await JobApplication.find({ email: email })
      .populate('jobId', 'title')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await JobApplication.countDocuments({ email: email });

    return successResponse(res, 'User job applications fetched successfully', {
      applications,
      total,
      page,
      limit,
    });
  } catch (error) {
    return errorResponse(res, 'Server Error', error);
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 'Invalid application ID');
    }

    const application = await JobApplication.findById(id).populate(
      'jobId',
      'title'
    );

    if (!application) {
      return errorResponse(res, 'Application not found');
    }

    return successResponse(
      res,
      'Job application fetched successfully',
      application
    );
  } catch (error) {
    return errorResponse(res, 'Server Error', error);
  }
};

export {
  applyForJob,
  getAllApplications,
  getApplicationsByUser,
  getApplicationById
};
