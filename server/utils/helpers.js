const Notification = require('../models/Notification');
const Activity = require('../models/Activity');

// Create a notification for a user
const createNotification = async ({ user, message, type = 'system', project, task }) => {
  if (!user) return null;
  try {
    const notif = await Notification.create({
      user,
      message,
      type,
      project,
      task,
    });
    return notif;
  } catch (err) {
    console.error('Notification create failed:', err.message);
    return null;
  }
};

// Log an activity for a project
const logActivity = async ({ project, user, action, description }) => {
  if (!project || !user) return null;
  try {
    const activity = await Activity.create({
      project,
      user,
      action,
      description,
    });
    return activity;
  } catch (err) {
    console.error('Activity log failed:', err.message);
    return null;
  }
};

// Helper to format a date to readable string
const formatDate = (date) => {
  if (!date) return 'No date';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

module.exports = { createNotification, logActivity, formatDate };
