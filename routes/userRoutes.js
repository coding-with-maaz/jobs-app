const express = require('express');
const {
  step1, step2, step3, step4,
  signIn, getUserProfile, updateUserProfile,
  adminGetAllUsers, adminDeleteUser, changePassword
} = require('../controllers/userController');

// Middlewares
const { requireAuth, requireAdmin, requireUser } = require('../middlewares/authMiddleware');

const router = express.Router();

// Onboarding + sign in
router.post('/onboarding/step1', step1);
router.post('/onboarding/step2', step2);
router.post('/onboarding/step3', step3);
router.post('/onboarding/step4', step4);
router.post('/signin', signIn);

// Profile routes
router.get('/profile', requireAuth, getUserProfile);
router.patch('/profile', requireAuth, updateUserProfile);

// Admin routes
router.get('/admin/users', requireAuth, adminGetAllUsers);
router.delete('/admin/delete/:userId', requireAuth, requireAdmin, adminDeleteUser);

// Password change route
router.patch('/change-password', requireAuth, changePassword);

module.exports = router;
