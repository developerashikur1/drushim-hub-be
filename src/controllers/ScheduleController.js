import Job from '../models/Job.js';
import Schedule from '../models/schedule.js';
import { errorResponse, successResponse } from '../utils/response.js';

// Create a new schedule
export const createSchedule = async (req, res) => {
  try {
    const { platform, date, content, postId, groupId } = req.body;



    // Validate that job exists
    const job = await Job.findById(postId);
    if (!job) return errorResponse(res, 'Associated job not found');

    const schedule = new Schedule({
      platform,
      date,
      content,
      postId,
      groupId,
      userId: req.user.id
    });

    await schedule.save();
    return successResponse(res, 'Schedule created successfully', schedule);
  } catch (error) {
    return errorResponse(res, 'Failed to create schedule', error);
  }
};

// Create a new schedule
export const createMultipleSchedules = async (req, res) => {
  try {
    console.log("this is my body data", req.body);
    // const { platform, date, content, postId, groupId } = req.body;



    // Validate that job exists
    // const job = await Job.findById(req.body.postId);
    // if (!job) return errorResponse(res, 'Associated job not found');

    // const schedule = new Schedule(req.body);
    const schedule = await Schedule.create(req.body);

    // await schedule.save();
    return successResponse(res, 'Schedule created successfully', schedule);
  } catch (error) {
    return errorResponse(res, 'Failed to create schedule', error);
  }
};

// Update a schedule
export const updateSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const schedule = await Schedule.findByIdAndUpdate(id, req.body, { new: true });
    if (!schedule) return errorResponse(res, 'Schedule not found');
    return successResponse(res, 'Schedule updated successfully', schedule);
  } catch (error) {
    return errorResponse(res, 'Failed to update schedule', error);
  }
};

// Delete a schedule
export const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) return errorResponse(res, 'Schedule not found');
    return successResponse(res, 'Schedule deleted successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to delete schedule', error);
  }
};

// Get a schedule by ID
export const getScheduleById = async (req, res) => {
  const { id } = req.params;
  try {
    const schedule = await Schedule.findById(id).populate('postId', 'title').populate('userId', 'name');
    if (!schedule) return errorResponse(res, 'Schedule not found');
    return successResponse(res, 'Schedule retrieved successfully', schedule);
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve schedule', error);
  }
};


export const getAllSchedules = async (req, res) => {
    try {
      const { platform, date, postId, userId } = req.query;
  
      console.log(req.query);
      const query = {
        
      };
      if (platform) query.platform = { $regex: platform, $options: 'i' };
      if (date) query.date = date;
      if (postId) query.postId = postId;
      if (userId) query.userId = userId;
  
      const schedules = await Schedule.find(query)
        .populate('postId')
        .populate('userId', 'name');
  
      return successResponse(res, 'Schedules retrieved successfully', schedules);
    } catch (error) {
      return errorResponse(res, 'Failed to retrieve schedules', error);
    }
  };
  


// Get all schedules (optional filters: platform, date, postId, userId)
// export const getAllSchedules = async (req, res) => {
//     try {
//         const { platform, date, postId } = req.query;

//         const query = { userId: req.user.id }; // Always filter by current user
//         if (platform) query.platform = { $regex: platform, $options: 'i' };
//         if (date) query.date = date;
//         if (postId) query.postId = postId;

//         const schedules = await Schedule.find(query)
//             .populate('postId', 'title')
//             .populate('userId', 'name');

//         return successResponse(res, 'Schedules retrieved successfully', schedules);
//     } catch (error) {
//         return errorResponse(res, 'Failed to retrieve schedules', error);
//     }
// };


// export const getAllSchedules = async (req, res) => {
//     try {
//     //   const { platform, date, postId } = req.query;
      
//     //   // Get the current user's ID from the authenticated request
//     //   const currentUserId = req.user.id; // Assuming user info is attached to req.user after authentication
//     //   console.log({currentUserId});
      
//     //   // Always filter by the current user's ID
//     //   const query = { userId: currentUserId };
      
//     //   // Add additional filters if provided
//     // //   if (platform) query.platform = { $regex: platform, $options: 'i' };
//     // //   if (date) query.date = date;
//     // //   if (postId) query.postId = postId;
    
//     // const schedules = await Schedule.find(query)
//     // .populate('postId', 'title')
//     // .populate('userId', 'name');
//     // console.log({schedules});
        
//     //   return successResponse(res, 'Your schedules retrieved successfully', schedules);
//     } catch (error) {
//       return errorResponse(res, 'Failed to retrieve schedules', error);
//     }
//   };

// export const getAllSchedules = async (req, res) => {
//     try {
//       const { platform, date, postId, userId } = req.query;
  
//       const query = {};
//       if (platform) query.platform = { $regex: platform, $options: 'i' };
//       if (date) query.date = date;
//       if (postId) query.postId = postId;
//       if (userId) query.userId = userId;
  
//       const schedules = await Schedule.find(query)
//         .populate('postId', 'title')
//         .populate('userId', 'name');
  
//       return successResponse(res, 'Schedules retrieved successfully', schedules);
//     } catch (error) {
//       return errorResponse(res, 'Failed to retrieve schedules', error);
//     }
//   };
  


  