const Notification = require('../models/Notification');
const AppError = require('../utils/appError');
const { catchAsync } = require('../middleware/errorHandler');

// @desc    Get notifications for current user
// @route   GET /api/notifications
// @access  Private
const getNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user.id })
    .sort('-createdAt')
    .limit(50);

  const unread = notifications.filter((n) => !n.read).length;

  res.status(200).json({
    success: true,
    count: notifications.length,
    unread,
    data: notifications,
  });
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = catchAsync(async (req, res, next) => {
  let notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  if (notification.user.toString() !== req.user.id) {
    return next(new AppError('Not authorized to access this notification', 403));
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({ success: true, data: notification });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = catchAsync(async (req, res, next) => {
  await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
  res.status(200).json({ success: true, message: 'All notifications marked as read' });
});

module.exports = { getNotifications, markAsRead, markAllAsRead };
