const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: false,
    message: err.message || "Internal server error",
    errors: err.errors || {},
  });
};

module.exports = errorHandler;
