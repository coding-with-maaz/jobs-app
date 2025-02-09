const Notification = require('../models/Notification');

/**
 * Create a new notification.
 * @param {Object} data - { user, type, message, job (optional) }
 * @returns {Promise<Notification>}
 */
exports.createNotification = async (data) => {
  const notification = new Notification(data);
  await notification.save();
  return notification;
};

/**
 * Get all notifications for a specific user.
 * @param {string} userId
 * @returns {Promise<Notification[]>}
 */
exports.getNotifications = async (userId) => {
  return await Notification.find({ user: userId }).sort({ createdAt: -1 });
};

/**
 * Delete a single notification by its ID.
 * @param {string} notificationId
 * @returns {Promise<Notification>}
 * @throws {Error} if notification not found
 */
exports.deleteNotification = async (notificationId) => {
  const deleted = await Notification.findByIdAndDelete(notificationId);
  if (!deleted) {
    throw new Error('Notification not found');
  }
  return deleted;
};

/**
 * Clear (delete) all notifications for a user.
 * @param {string} userId
 * @returns {Promise}
 */
exports.clearNotifications = async (userId) => {
  await Notification.deleteMany({ user: userId });
};
