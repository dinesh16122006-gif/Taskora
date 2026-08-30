const User = require('../models/User');
const Task = require('../models/Task');
const AppError = require('../utils/appError');
const { catchAsync } = require('../middleware/errorHandler');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const tasks = await Task.find({ assignedTo: user._id }).populate('project', 'name');

  res.status(200).json({
    success: true,
    data: {
      user,
      tasks,
    },
  });
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUser = catchAsync(async (req, res, next) => {
  // Only allow user to update their own profile unless admin
  if (req.params.id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You can only update your own profile', 403));
  }

  const { name, email } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Change password
// @route   PUT /api/users/:id/password
// @access  Private
const changePassword = catchAsync(async (req, res, next) => {
  if (req.params.id !== req.user.id) {
    return next(new AppError('You can only change your own password', 403));
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Please provide current and new password', 400));
  }

  const user = await User.findById(req.params.id).select('+password');

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return next(new AppError('Current password is incorrect', 400));
  }

  if (newPassword.length < 6) {
    return next(new AppError('New password must be at least 6 characters', 400));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully' });
});

module.exports = { getUsers, getUser, updateUser, changePassword };
