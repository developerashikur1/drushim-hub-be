// const { successResponse, errorResponse } = require('../utils/response.js');

// exports.uploadFile = async (req, res) => {
//   try {
//     if (!req.file) {
//       return errorResponse(res, 'No file uploaded', null, 400);
//     }

//     // Create the file URL
//     const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${
//       req.file.filename
//     }`;

//     // Return the file information
//     return successResponse(res, 'File uploaded successfully', {
//       fileName: req.file.originalname,
//       filePath: fileUrl,
//       fileSize: req.file.size,
//       mimeType: req.file.mimetype,
//     });
//   } catch (error) {
//     console.error('File upload error:', error);
//     return errorResponse(res, 'Error uploading file', error, 500);
//   }
// };


import { successResponse, errorResponse } from '../utils/response.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', null, 400);
    }

    // Create the file URL
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${
      req.file.filename
    }`;

    // Return the file information
    return successResponse(res, 'File uploaded successfully', {
      fileName: req.file.originalname,
      filePath: fileUrl,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return errorResponse(res, 'Error uploading file', error, 500);
  }
};