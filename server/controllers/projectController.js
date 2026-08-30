const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const AppError = require('../utils/appError');
const { catchAsync } = require('../middleware/errorHandler');
const { logActivity, createNotification } = require('../utils/helpers');

// Helper to calculate project progress from tasks
const calculateProgress = async (projectId) => {
  const tasks = await Task.find({ project: projectId });
  if (!tasks.length) return 0;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  return Math.round((completed / tasks.length) * 100);
};

// @desc    Get all projects for current user
// @route   GET /api/projects
// @access  Private
const getProjects = catchAsync(async (req, res, next) => {
  const search = req.query.search || '';
  const status = req.query.status || '';
  const priority = req.query.priority || '';

  const filter = {
    $or: [{ owner: req.user.id }, { members: req.user.id }],
  };

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  if (status) {
    filter.status = status;
  }
  if (priority) {
    filter.priority = priority;
  }

  const projects = await Project.find(filter)
    .populate('owner', 'name email')
    .populate('members', 'name email')
    .populate('tasks')
    .sort('-createdAt');

  const projectsWithProgress = await Promise.all(
    projects.map(async (project) => {
      const tasks = await Task.find({ project: project._id });
      const completed = tasks.filter((t) => t.status === 'Completed').length;
      const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
      return {
        ...project.toObject(),
        progress,
        taskStats: {
          total: tasks.length,
          completed,
          pending: tasks.length - completed,
        },
      };
    })
  );

  res.status(200).json({ success: true, count: projects.length, data: projectsWithProgress });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('members', 'name email');

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Check access
  const isOwner = project.owner._id.toString() === req.user.id;
  const isMember = project.members.some((m) => m._id.toString() === req.user.id);
  if (!isOwner && !isMember && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to access this project', 403));
  }

  const tasks = await Task.find({ project: project._id })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort('-createdAt');

  const activities = await Activity.find({ project: project._id })
    .populate('user', 'name email')
    .sort('-createdAt');

  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const taskStats = {
    total: tasks.length,
    completed,
    pending: tasks.length - completed,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    review: tasks.filter((t) => t.status === 'Review').length,
    todo: tasks.filter((t) => t.status === 'To Do').length,
  };

  res.status(200).json({
    success: true,
    data: {
      ...project.toObject(),
      progress,
      taskStats,
      tasks,
      activities,
    },
  });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = catchAsync(async (req, res, next) => {
  const { name, description, startDate, deadline, status, priority, members } = req.body;

  if (!name) {
    return next(new AppError('Project name is required', 400));
  }

  if (startDate && deadline && new Date(startDate) > new Date(deadline)) {
    return next(new AppError('Start date cannot be after the deadline', 400));
  }

  const membersList = Array.isArray(members) ? members.filter((m) => m) : [];

  const project = await Project.create({
    name,
    description: description || '',
    owner: req.user.id,
    startDate,
    deadline,
    status,
    priority,
    members: membersList,
  });

  await logActivity({
    project: project._id,
    user: req.user.id,
    action: 'Project created',
    description: `${req.user.name} created the project "${project.name}"`,
  });

  // Notify members
  for (const memberId of membersList) {
    await createNotification({
      user: memberId,
      message: `You were added to project "${project.name}"`,
      type: 'update',
      project: project._id,
    });
  }

  res.status(201).json({ success: true, data: project });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (owner/admin)
const updateProject = catchAsync(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Only the project owner can update this project', 403));
  }

  const { name, description, startDate, deadline, status, priority, members } = req.body;

  if (startDate && deadline && new Date(startDate) > new Date(deadline)) {
    return next(new AppError('Start date cannot be after the deadline', 400));
  }

  const oldStatus = project.status;
  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;
  if (startDate !== undefined) project.startDate = startDate;
  if (deadline !== undefined) project.deadline = deadline;
  if (status !== undefined) project.status = status;
  if (priority !== undefined) project.priority = priority;
  if (members !== undefined) {
    const membersList = Array.isArray(members) ? members.filter((m) => m) : [];
    // Notify newly added members
    const currentMembers = project.members.map((m) => m.toString());
    const newMembers = membersList.filter((m) => !currentMembers.includes(m));
    project.members = membersList;
    for (const memberId of newMembers) {
      await createNotification({
        user: memberId,
        message: `You were added to project "${project.name}"`,
        type: 'update',
        project: project._id,
      });
    }
  }

  await project.save();

  await logActivity({
    project: project._id,
    user: req.user.id,
    action: 'Project updated',
    description: `${req.user.name} updated project "${project.name}"${
      oldStatus !== project.status ? ` (status changed to ${project.status})` : ''
    }`,
  });

  res.status(200).json({ success: true, data: project });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (owner/admin)
const deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Only the project owner can delete this project', 403));
  }

  const projectName = project.name;
  await Task.deleteMany({ project: project._id });
  await Activity.deleteMany({ project: project._id });
  await Notification.deleteMany({ project: project._id });
  await project.remove();

  res.status(200).json({ success: true, message: `Project "${projectName}" deleted` });
});

// @desc    Get project analytics
// @route   GET /api/projects/:id/analytics
// @access  Private
const getProjectAnalytics = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  const tasks = await Task.find({ project: project._id });

  const byStatus = {
    'To Do': 0,
    'In Progress': 0,
    'Review': 0,
    'Completed': 0,
  };
  const byPriority = { Low: 0, Medium: 0, High: 0 };
  const byAssignee = {};

  tasks.forEach((t) => {
    if (byStatus[t.status] !== undefined) byStatus[t.status]++;
    if (byPriority[t.priority] !== undefined) byPriority[t.priority]++;
    if (t.assignedTo) {
      const key = t.assignedTo.toString();
      byAssignee[key] = (byAssignee[key] || 0) + 1;
    }
  });

  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalTasks: tasks.length,
        completed,
        progress,
      },
      byStatus,
      byPriority,
      byAssignee,
    },
  });
});

// @desc    Get dashboard analytics
// @route   GET /api/projects/analytics/dashboard
// @access  Private
const getDashboard = catchAsync(async (req, res, next) => {
  const projects = await Project.find({
    $or: [{ owner: req.user.id }, { members: req.user.id }],
  });

  const projectIds = projects.map((p) => p._id);

  const tasks = await Task.find({
    project: { $in: projectIds },
    $or: [{ assignedTo: req.user.id }, { createdBy: req.user.id }, { project: { $in: projectIds } }],
  }).populate('project', 'name');

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === 'In Progress').length,
    completedProjects: projects.filter((p) => p.status === 'Completed').length,
    totalTasks: tasks.length,
    pendingTasks: tasks.filter((t) => t.status !== 'Completed').length,
    completedTasks: tasks.filter((t) => t.status === 'Completed').length,
    overdueTasks: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < today && t.status !== 'Completed').length,
    taskCompletion: tasks.length
      ? Math.round((tasks.filter((t) => t.status === 'Completed').length / tasks.length) * 100)
      : 0,
  };

  const tasksByStatus = {
    'To Do': tasks.filter((t) => t.status === 'To Do').length,
    'In Progress': tasks.filter((t) => t.status === 'In Progress').length,
    'Review': tasks.filter((t) => t.status === 'Review').length,
    'Completed': tasks.filter((t) => t.status === 'Completed').length,
  };

  const tasksByPriority = {
    Low: tasks.filter((t) => t.priority === 'Low').length,
    Medium: tasks.filter((t) => t.priority === 'Medium').length,
    High: tasks.filter((t) => t.priority === 'High').length,
  };

  const recentProjects = projects.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  const recentTasks = tasks.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  // Upcoming deadlines
  const upcomingDeadlines = tasks
    .filter((t) => t.dueDate && t.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 10);

  const notifications = await Notification.find({ user: req.user.id })
    .sort('-createdAt')
    .limit(10);

  res.status(200).json({
    success: true,
    data: {
      stats,
      tasksByStatus,
      tasksByPriority,
      recentProjects,
      recentTasks,
      upcomingDeadlines,
      notifications,
    },
  });
});

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectAnalytics,
  getDashboard,
};
