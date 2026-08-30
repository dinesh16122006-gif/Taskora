const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectAnalytics,
  getDashboard,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/:id/analytics', getProjectAnalytics);

router
  .route('/')
  .get(getProjects)
  .post(createProject);

router
  .route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
