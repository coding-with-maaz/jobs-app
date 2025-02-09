const Category = require('../models/Category');

/**
 * Create a new category.
 * @param {object} data - Category data: { name, icon, count, color }
 * @returns {Promise<Category>}
 */
exports.createCategory = async (data) => {
  const category = new Category(data);
  await category.save();
  return category;
};

/**
 * Get all categories.
 * @returns {Promise<Category[]>}
 */
exports.getAllCategories = async () => {
  return await Category.find({});
};

/**
 * Get a category by ID.
 * @param {string} categoryId 
 * @returns {Promise<Category>}
 * @throws {Error} if category not found
 */
exports.getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

/**
 * Update a category by ID.
 * @param {string} categoryId 
 * @param {object} updates 
 * @returns {Promise<Category>}
 * @throws {Error} if category not found
 */
exports.updateCategory = async (categoryId, updates) => {
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!updatedCategory) {
    throw new Error('Category not found');
  }
  return updatedCategory;
};

/**
 * Delete a category by ID.
 * @param {string} categoryId 
 * @returns {Promise<Category>}
 * @throws {Error} if category not found
 */
exports.deleteCategory = async (categoryId) => {
  const deletedCategory = await Category.findByIdAndDelete(categoryId);
  if (!deletedCategory) {
    throw new Error('Category not found');
  }
  return deletedCategory;
};
