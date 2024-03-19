// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const authenticate = require('../middleware/authenticate');


// Create a task
router.post('/tasks',authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, status, dueDate } = req.body;
    const newTask = new Task({ title, description, status, dueDate, userId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /api/tasks?status=completed&dueDate=2024-03-15
router.get('/tasks', authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const { status, dueDate } = req.query;
  
      let query = { userId };
  
      // Apply filters based on query parameters
      if (status) {
        query.status = status;
      }
  
      if (dueDate) {
        query.dueDate = dueDate;
      }
  
      const tasks = await Task.find(query);
  
      res.json(tasks);
    } catch (error) {
      console.error('Error getting tasks:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Update a task
router.patch('/tasks/:taskId',authenticate, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      { title, description, status, dueDate },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a task
router.delete('/tasks/:taskId', authenticate,async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;