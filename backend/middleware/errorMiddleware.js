const errorHandler = (
  err,
  req,
  res,
  next
) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    stack:
      process.env.NODE_ENV ===
      "production"
        ? null
        : err.stack,
  });
};

module.exports = errorHandler;