const express = require('express');
const router = express.Router();
const {
  createNotification,
  getNotifications,
  deleteNotification,
  clearNotifications,
} = require('../controllers/notificationController');
const { requireAuth } = require('../middlewares/authMiddleware');

// For viewing, deleting, and clearing notifications, the user must be authenticated.
router.get('/', requireAuth, getNotifications);
router.delete('/:id', requireAuth, deleteNotification);
router.delete('/', requireAuth, clearNotifications);

// (Optional) For testing, to create a notification manually:
router.post('/', requireAuth, createNotification);

module.exports = router;
