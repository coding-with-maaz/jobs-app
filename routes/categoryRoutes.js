const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Import admin middleware (assumes you have these)
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

// All these routes require the user to be authenticated and an admin.
router.post('/', requireAuth, requireAdmin, createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.patch('/:id', requireAuth, requireAdmin, updateCategory);
router.delete('/:id', requireAuth, requireAdmin, deleteCategory);

module.exports = router;
