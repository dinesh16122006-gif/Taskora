const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['deadline', 'overdue', 'assignment', 'update', 'system'],
      default: 'system',
    },
    read: {
      type: Boolean,
      default: false,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
