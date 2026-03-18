const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: error.message || "Internal server error",
    statusCode: statusCode,
  });
};

module.exports = errorHandler;
