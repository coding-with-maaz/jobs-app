const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
  } = require('../services/categoryService');
  
  /**
   * ADMIN: Create a new category.
   * Expected JSON body: { name, icon, count, color }
   */
  exports.createCategory = async (req, res) => {
    try {
      const data = req.body;
      const category = await createCategory(data);
      return res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
      console.error('Error creating category:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  
  /**
   * ADMIN: Get all categories.
   */
  exports.getAllCategories = async (req, res) => {
    try {
      const categories = await getAllCategories();
      return res.status(200).json({ categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  
  /**
   * ADMIN: Get a category by ID.
   */
  exports.getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await getCategoryById(id);
      return res.status(200).json({ category });
    } catch (error) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error fetching category:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  
  /**
   * ADMIN: Update a category by ID.
   */
  exports.updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedCategory = await updateCategory(id, updates);
      return res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error updating category:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  
  /**
   * ADMIN: Delete a category by ID.
   */
  exports.deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCategory = await deleteCategory(id);
      return res.status(200).json({ message: 'Category deleted successfully', category: deletedCategory });
    } catch (error) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error deleting category:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  