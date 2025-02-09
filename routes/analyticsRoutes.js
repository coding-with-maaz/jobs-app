// routes/analyticsRoutes.js
const express = require('express');
const { getAnalytics } = require('../controllers/analyticsController');
const router = express.Router();

// Optionally, add authentication middleware if needed:
// const { requireAuth } = require('../middlewares/authMiddleware');
// router.get('/', requireAuth, getAnalytics);

router.get('/', getAnalytics);

module.exports = router;
