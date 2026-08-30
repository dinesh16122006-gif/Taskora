const User = require('../models/User');
const AppError = require('../utils/appError');
const { catchAsync, sendTokenResponse } = require('../middleware/errorHandler');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email and password', 400));
  }

  // Check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('An account with this email already exists', 400));
  }

  const user = await User.create({ name, email, password });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // select password to compare
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new AppError('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = { register, login, getMe };
