// controllers/userController.js

const {
    saveSkillsStep1,
    savePersonalInfoStep2,
    saveBioStep3,
    finalizeRegistrationStep4,
    signIn,
    getProfile,
    updateProfile,
    getAllUsers,
    deleteUserById,
    changePassword,
  } = require('../services/userService');
  
  /**
   * STEP 1 (Optional): Select Skills
   */
  exports.step1 = (req, res) => {
    try {
      const { skills } = req.body;
      const data = saveSkillsStep1(req.session, skills);
      return res.status(200).json({
        message: 'Step 1: skills saved (or skipped).',
        data,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
  /**
   * STEP 2 (Required): Personal Info
   */
  exports.step2 = (req, res) => {
    try {
      const { firstName, lastName, email, phone, location } = req.body;
      const data = savePersonalInfoStep2(req.session, {
        firstName,
        lastName,
        email,
        phone,
        location,
      });
      return res.status(200).json({
        message: 'Step 2: personal information saved.',
        data,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
  
  /**
   * STEP 3 (Optional): Bio
   */
  exports.step3 = (req, res) => {
    try {
      const { bio } = req.body;
      const data = saveBioStep3(req.session, bio);
      return res.status(200).json({
        message: 'Step 3: bio saved (or skipped).',
        data,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
  /**
   * STEP 4 (Required): Create Password and Finalize Registration
   */
  exports.step4 = async (req, res) => {
    try {
      const { password } = req.body;
      const newUser = await finalizeRegistrationStep4(req.session, password);
      return res.status(201).json({
        message: 'Registration complete!',
        userId: newUser._id,
      });
    } catch (error) {
      if (error.message.includes('Password is required')) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message.includes('Cannot complete registration')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error in final registration step:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  /**
   * SIGN IN Controller
   * Body: { identifier, password }
   * identifier = email, phone, firstName, or lastName
   */
  exports.signIn = async (req, res) => {
    try {
      const { identifier, password } = req.body;
  
      if (!identifier || !password) {
        return res
          .status(400)
          .json({ error: 'identifier and password are required.' });
      }
  
      // Call signIn from the service
      const user = await signIn(identifier, password);
  
      // Store userId and role in session for authentication
      req.session.userId = user._id;
      // If your User schema has a role field, store it:
      req.session.role = user.role;
  
      return res.status(200).json({
        message: 'Sign in successful!',
        user, // password is already undefined
      });
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: error.message });
      }
      console.error('Sign in error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  /**
   * GET Profile (for the current logged-in user)
   */
  exports.getUserProfile = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated.' });
      }
  
      const user = await getProfile(userId);
      return res.status(200).json({ user });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error fetching profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  /**
   * UPDATE Profile (for the current logged-in user)
   * Body can include fields like personalInformation, bio, skills
   */
  exports.updateUserProfile = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated.' });
      }
  
      const updates = req.body; // e.g. { personalInformation: {...}, bio: "...", skills: [...] }
      const updatedUser = await updateProfile(userId, updates);
  
      return res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error updating profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  /* ------------------------------------------------------------------
     ADMIN-ONLY FUNCTIONALITIES
     For these to work securely, you must:
     1) Have a 'role' field in your User model (e.g., default: 'user').
     2) On signIn, store req.session.role = user.role.
     3) Protect these routes with a middleware that checks (req.session.role === 'admin').
     ------------------------------------------------------------------ */
  
 /**
 * ADMIN: Get all users
 */
exports.adminGetAllUsers = async (req, res) => {
    try {
      // Check if the current session is admin
      if (req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admins only.' });
      }
  
      const users = await getAllUsers(); // This function is imported from userService
      return res.status(200).json({ users });
    } catch (error) {
      console.error('Error retrieving all users (admin):', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  /**
   * ADMIN: Delete user by ID
   * Endpoint example: DELETE /api/users/admin/delete/:userId
   */
  exports.adminDeleteUser = async (req, res) => {
    try {
      // Check if the current session is admin
      if (req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admins only.' });
      }
  
      const { userId } = req.params; // Expecting a URL parameter named userId
      const deletedUser = await deleteUserById(userId);
      return res.status(200).json({
        message: 'User deleted successfully',
        user: deletedUser,
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' });
      }
      console.error('Error deleting user (admin):', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
 * Change Password Controller
 * Body: { oldPassword, newPassword }
 */
exports.changePassword = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated.' });
      }
  
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Both old and new passwords are required.' });
      }
  
      await changePassword(userId, oldPassword, newPassword);
      return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
      if (error.message === 'Old password is incorrect.') {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error changing password:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };