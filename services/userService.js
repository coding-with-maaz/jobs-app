const User = require('../models/User');
const bcrypt = require('bcrypt');

/**
 * STEP 1 (Optional): Save the user’s selected skills in the session
 */
exports.saveSkillsStep1 = (session, skills) => {
  session.userData = session.userData || {};
  session.userData.skills = Array.isArray(skills) ? skills : [];
  return session.userData.skills;
};

/**
 * STEP 2 (Required): Save personal information in the session
 */
exports.savePersonalInfoStep2 = (session, personalInfo) => {
  const { firstName, lastName, email, phone, location } = personalInfo;

  if (!firstName || !lastName || !email) {
    throw new Error('firstName, lastName, and email are required.');
  }

  session.userData = session.userData || {};
  session.userData.personalInformation = {
    firstName,
    lastName,
    email,
    phone: phone || '',
    location: location || '',
  };

  return session.userData.personalInformation;
};

/**
 * STEP 3 (Optional): Save bio in the session
 */
exports.saveBioStep3 = (session, bio) => {
  session.userData = session.userData || {};
  session.userData.bio = bio || '';
  return session.userData.bio;
};

/**
 * STEP 4 (Required): Create the User in the DB
 */
exports.finalizeRegistrationStep4 = async (session, password) => {
  if (!password) {
    throw new Error('Password is required to complete registration.');
  }

  const userData = session.userData;
  if (!userData || !userData.personalInformation) {
    throw new Error(
      'Cannot complete registration. Personal information missing (Step 2).'
    );
  }

  // Build user object
  const newUser = new User({
    password, // hashed in userModel pre-save hook
    skills: userData.skills || [],
    bio: userData.bio || '',
    personalInformation: {
      firstName: userData.personalInformation.firstName,
      lastName: userData.personalInformation.lastName,
      email: userData.personalInformation.email,
      phone: userData.personalInformation.phone,
      location: userData.personalInformation.location,
    },
  });

  // Save the user
  await newUser.save();

  // Clear session data so it’s fresh for next time
  session.userData = null;

  return newUser;
};

/**
 * Sign in with identifier (email, phone, firstName, or lastName) + password
 */
exports.signIn = async (identifier, password) => {
  // 1. Find user by identifier
  const user = await User.findOne({
    $or: [
      { 'personalInformation.email': identifier },
      { 'personalInformation.phone': identifier },
      { 'personalInformation.firstName': identifier },
      { 'personalInformation.lastName': identifier },
    ],
  }).select('+password'); // ensure password is included

  if (!user) {
    throw new Error('Invalid credentials'); // user not found
  }

  // 2. Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials'); // password mismatch
  }

  // 3. Return user with password removed
  user.password = undefined;
  return user;
};

/**
 * Get a user by ID (excluding password)
 */
exports.getProfile = async (userId) => {
  if (!userId) {
    throw new Error('No userId provided to getProfile.');
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

/**
 * Update user profile by ID
 */
exports.updateProfile = async (userId, updates) => {
  if (!userId) {
    throw new Error('No userId provided to updateProfile.');
  }

  const { personalInformation, bio, skills } = updates;
  const updateData = {};
  if (personalInformation) updateData.personalInformation = personalInformation;
  if (typeof bio === 'string') updateData.bio = bio;
  if (Array.isArray(skills)) updateData.skills = skills;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password');

  if (!updatedUser) {
    throw new Error('User not found');
  }
  return updatedUser;
};

/* ------------------------------------------------------------------
   ADMIN-ONLY FUNCTIONS
   Ensure you protect these with admin checks in your controllers/middleware.
   ------------------------------------------------------------------ */

/**
 * Get all users (admin)
 * @returns {Promise<User[]>} - Array of all user docs (password excluded)
 */
exports.getAllUsers = async () => {
  return await User.find({}).select('-password');
};

/**
 * Delete a user by ID (admin)
 * @param {string} userId - The user's MongoDB _id to delete
 * @throws {Error} if user not found
 * @returns {Promise<User>} - The deleted user document
 */
exports.deleteUserById = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new Error('User not found');
  }
  return deletedUser;
};

/**
 * Change password for a user.
 * @param {string} userId - The user's MongoDB _id.
 * @param {string} oldPassword - The current (old) password.
 * @param {string} newPassword - The new password to set.
 * @throws {Error} if the user is not found or the old password is incorrect.
 * @returns {Promise<User>} - The updated user document (with password removed).
 */
exports.changePassword = async (userId, oldPassword, newPassword) => {
  if (!oldPassword || !newPassword) {
    throw new Error('Both old and new passwords are required.');
  }

  // Fetch the user, ensuring we include the password field.
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new Error('User not found');
  }

  // Compare the provided old password with the stored hashed password.
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error('Old password is incorrect');
  }

  // Set the new password; the pre-save hook on the User model will hash it.
  user.password = newPassword;
  await user.save();

  // Remove the password field before returning the user.
  user.password = undefined;
  return user;
};
