// controllers/analyticsController.js
const { getMonthlyAnalytics } = require('../services/analyticsService');

/**
 * GET /api/analytics
 * Retrieves real-time monthly analytics data.
 */
exports.getAnalytics = async (req, res) => {
  try {
    const monthlyData = await getMonthlyAnalytics();
    return res.status(200).json({ monthlyData });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
