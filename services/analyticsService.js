// services/analyticsService.js
const Application = require('../models/Application'); // Ensure you have this model

/**
 * Get monthly analytics data from real-time application records.
 * It aggregates the total number of applications and hires for each month.
 *
 * @returns {Promise<Array>} Array of objects, e.g.:
 * [
 *   { name: 'Jan', applications: 400, hires: 24 },
 *   { name: 'Feb', applications: 300, hires: 18 },
 *   ...
 * ]
 */
exports.getMonthlyAnalytics = async () => {
  // Aggregate data from the Application collection.
  // Assumes each Application document has a "createdAt" field and a "status" field.
  const analytics = await Application.aggregate([
    {
      // Group documents by the month of creation.
      $group: {
        _id: { month: { $month: '$createdAt' } },
        applications: { $sum: 1 },
        hires: {
          $sum: {
            $cond: [{ $eq: ['$status', 'hired'] }, 1, 0],
          },
        },
      },
    },
    {
      // Reshape the document: remove _id and include month as a number.
      $project: {
        _id: 0,
        month: '$_id.month',
        applications: 1,
        hires: 1,
      },
    },
    {
      // Sort by month in ascending order.
      $sort: { month: 1 },
    },
  ]);

  // Map numeric month values to abbreviated month names.
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const monthlyData = analytics.map((item) => ({
    name: monthNames[item.month - 1],
    applications: item.applications,
    hires: item.hires,
  }));

  return monthlyData;
};
