const Task = require('../models/Task');
const Project = require('../models/Project');
const AppError = require('../utils/appError');
const { catchAsync } = require('../middleware/errorHandler');
const { logActivity, createNotification } = require('../utils/helpers');

// Helper to check project access
const checkProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: new AppError('Project not found', 404) };
  const isOwner = project.owner.toString() === userId;
  const isMember = project.members.some((m) => m.toString() === userId);
  if (!isOwner && !isMember) {
    return { error: new AppError('Not authorized to access this project', 403) };
  }
  return { project };
};

// @desc    Get all tasks (optional filter by project)
// @route   GET /api/tasks?project=:id
// @access  Private
const getTasks = catchAsync(async (req, res, next) => {
  const { project, status, priority, assignedTo, search } = req.query;
  const filter = {};

  if (project) {
    const { error } = await checkProjectAccess(project, req.user.id);
    if (error) return next(error);
    filter.project = project;
  } else {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    });
    filter.project = { $in: projects.map((p) => p._id) };
  }

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const tasks = await Task.find(filter)
    .populate('project', 'name')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort('-createdAt');

  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('project', 'name owner members')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  res.status(200).json({ success: true, data: task });
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = catchAsync(async (req, res, next) => {
  const { title, description, project, assignedTo, status, priority, dueDate } = req.body;

  if (!title) {
    return next(new AppError('Task title is required', 400));
  }
  if (!project) {
    return next(new AppError('Task must belong to a project', 400));
  }

  const { project: proj, error } = await checkProjectAccess(project, req.user.id);
  if (error) return next(error);

  if (assignedTo) {
    const isMember = proj.members.some((m) => m.toString() === assignedTo) ||
      proj.owner.toString() === assignedTo;
    if (!isMember) {
      return next(new AppError('Assigned user must be a member of the project', 400));
    }
  }

  const task = await Task.create({
    title,
    description: description || '',
    project,
    assignedTo,
    createdBy: req.user.id,
    status: status || 'To Do',
    priority: priority || 'Medium',
    dueDate,
  });

  await logActivity({
    project,
    user: req.user.id,
    action: 'Task created',
    description: `${req.user.name} created task "${task.title}"`,
  });

  if (assignedTo) {
    await logActivity({
      project,
      user: req.user.id,
      action: 'Task assigned',
      description: `${req.user.name} assigned "${task.title}" to a member`,
    });
    await createNotification({
      user: assignedTo,
      message: `You were assigned task "${task.title}"${proj.name ? ` in ${proj.name}` : ''}`,
      type: 'assignment',
      project,
      task: task._id,
    });
  }

  res.status(201).json({ success: true, data: task });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = catchAsync(async (req, res, next) => {
  let task = await Task.findById(req.params.id).populate('project', 'name owner');
  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  const oldStatus = task.status;
  const { title, description, assignedTo, status, priority, dueDate } = req.body;

  const projectId = task.project._id;
  const { project: proj, error } = await checkProjectAccess(
    projectId.toString(),
    req.user.id
  );
  if (error) return next(error);

  let newlyAssignedUserId;
  if (assignedTo !== undefined && assignedTo !== task.assignedTo?.toString()) {
    if (assignedTo) {
      const isMember = proj.members.some((m) => m.toString() === assignedTo) ||
        proj.owner.toString() === assignedTo;
      if (!isMember) {
        return next(new AppError('Assigned user must be a member of the project', 400));
      }
      newlyAssignedUserId = assignedTo;
    }
    task.assignedTo = assignedTo || undefined;
  }
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;

  await task.save();

  // Notify assignee if newly assigned
  if (newlyAssignedUserId) {
    await createNotification({
      user: newlyAssignedUserId,
      message: `You were assigned task "${task.title}"`,
      type: 'assignment',
      project: projectId,
      task: task._id,
    });
  }

  if (oldStatus !== task.status) {
    await logActivity({
      project: projectId,
      user: req.user.id,
      action: 'Task status changed',
      description: `${req.user.name} moved "${task.title}" from ${oldStatus} to ${task.status}`,
    });
    if (task.status === 'Completed') {
      await logActivity({
        project: projectId,
        user: req.user.id,
        action: 'Task completed',
        description: `Task "${task.title}" was completed`,
      });
    }
  }

  res.status(200).json({ success: true, data: task });
});

// @desc    Update task status only (for kanban)
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['To Do', 'In Progress', 'Review', 'Completed'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid task status', 400));
  }

  const task = await Task.findById(req.params.id).populate('project', 'name');
  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  const oldStatus = task.status;
  task.status = status;
  await task.save();

  await logActivity({
    project: task.project._id,
    user: req.user.id,
    action: 'Task status changed',
    description: `${req.user.name} moved "${task.title}" from ${oldStatus} to ${status}`,
  });
  if (status === 'Completed') {
    await logActivity({
      project: task.project._id,
      user: req.user.id,
      action: 'Task completed',
      description: `Task "${task.title}" was completed`,
    });
  }

  res.status(200).json({ success: true, data: task });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate('project', 'name');
  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  const projectId = task.project._id;
  const { error } = await checkProjectAccess(projectId.toString(), req.user.id);
  if (error) return next(error);

  const taskTitle = task.title;
  await task.remove();

  await logActivity({
    project: projectId,
    user: req.user.id,
    action: 'Task deleted',
    description: `${req.user.name} deleted task "${taskTitle}"`,
  });

  res.status(200).json({ success: true, message: 'Task deleted' });
});

module.exports = { getTasks, getTask, createTask, updateTask, updateTaskStatus, deleteTask };
