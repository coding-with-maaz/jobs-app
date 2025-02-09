const {
    createNotification,
    getNotifications,
    deleteNotification,
    clearNotifications,
  } = require('../services/notificationService');
  
  /**
   * (Optional) Create Notification - This endpoint can be used for testing,
   * or be called from other services (like job creation).
   * Body should include: { user, type, message, job (optional) }
   */
  exports.createNotification = async (req, res) => {
    try {
      const { user, type, message, job } = req.body;
      const notification = await createNotification({ user, type, message, job });
      return res.status(201).json({ message: 'Notification created', notification });
    } catch (error) {
      console.error('Error creating notification:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  
  /**
   * Get all notifications for the logged-in user.
   */
  exports.getNotifications = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated.' });
      }
      const notifications = await getNotifications(userId);
      return res.status(200).json({ notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  
  /**
   * Delete a single notification by its ID.
   */
  exports.deleteNotification = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await deleteNotification(id);
      return res.status(200).json({ message: 'Notification deleted', notification: deleted });
    } catch (error) {
      if (error.message === 'Notification not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error deleting notification:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  
  /**
   * Clear all notifications for the logged-in user.
   */
  exports.clearNotifications = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated.' });
      }
      await clearNotifications(userId);
      return res.status(200).json({ message: 'All notifications cleared' });
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  