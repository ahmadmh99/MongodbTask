const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Task = require('../models/task');
const authenticate = require('../middleware/authenticate');

// Create a new category
router.post('/categories', authenticate, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;

    const category = new Category({ name, tasks: [], userId });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all categories for a user
router.get('/categories', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const categories = await Category.find({ userId });

    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a category (add or remove tasks)
router.patch('/categories/:categoryId', authenticate, async (req, res) => {
  try {
    const { taskId, action } = req.body;
    const userId = req.userId;
    const categoryId = req.params.categoryId;

    // Find the category by ID
    const category = await Category.findOne({ _id: categoryId, userId });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Add or remove the task based on the action
    if (action === 'add') {
      category.tasks.push(task);
    } else if (action === 'remove') {
      category.tasks = category.tasks.filter(taskId => taskId.toString() !== task._id.toString());
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Save the updated category
    await category.save();

    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a category
router.delete('/categories/:categoryId', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const categoryId = req.params.categoryId;

    // Find and remove the category by ID
    const category = await Category.findOneAndRemove({ _id: categoryId, userId });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
