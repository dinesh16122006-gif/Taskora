const AppError = require('../utils/appError');

// Wrapper to catch async errors
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Helper to generate JWT
const signToken = (id) => {
  return require('jsonwebtoken').sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

// Not Found handler
const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id ${err.value}`;
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `Duplicate value entered for ${field}: ${err.keyValue?.[field]}. Please use a different value.`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new AppError(messages.join(', '), 400);
  }

  // Invalid JWT
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', 401);
  }

  // Expired JWT
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Session expired. Please log in again.', 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = { catchAsync, signToken, sendTokenResponse, notFound, errorHandler };
