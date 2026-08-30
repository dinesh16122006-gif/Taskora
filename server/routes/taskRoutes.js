const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.put('/:id/status', updateTaskStatus);
router
  .route('/')
  .get(getTasks)
  .post(createTask);
router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
