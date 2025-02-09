const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');

// Import admin middleware (assumes you have these)
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

// All these routes require the user to be authenticated and an admin.
router.post('/', requireAuth, createJob);
router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.patch('/:id', requireAuth, requireAdmin, updateJob);
router.delete('/:id', requireAuth, requireAdmin, deleteJob);

module.exports = router;
