const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.put('/read-all', markAllAsRead);
router.get('/', getNotifications);
router.put('/:id/read', markAsRead);

module.exports = router;
