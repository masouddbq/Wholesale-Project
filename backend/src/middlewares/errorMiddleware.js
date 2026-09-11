const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Zod Error
  if (err.name === "ZodError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map(
        (error) => ({
          field: error.path,
          message: error.message,
        })
      ),
    });
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID",
    });
  }

  // MongoDB Duplicate Key
  if (err.code === 11000) {
    const field = Object.keys(
      err.keyPattern || {}
    )[0];

    return res.status(409).json({
      message: `Duplicate value for ${field || "field"}`,
    });
  }

  // Default Error
  res.status(err.statusCode || 500).json({
    message:
      err.message || "Internal server error",
  });
};

module.exports = errorHandler;