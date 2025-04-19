const successResponse = (res, message, data=null) => {
   return res.status(200).json({
      success: true,
      message,
      data,
    });
  };
  
  const errorResponse = (res, message, error = null, status = 400) => {
    return res.status(typeof status === "number" ? status : 400).json({
      success: false,
      message,
      error, // Include error if provided
    });
  };
  module.exports = { successResponse, errorResponse };