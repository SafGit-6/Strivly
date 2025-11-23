const express = require('express');
const router = express.Router();
const { createTask, getAllTasks, updateTask, deleteTask, completeTask } = require('../controllers/task.controller');
const protect = require('../middleware/auth.middleware');

// Routes for getting all tasks and creating a new one
router.route('/')
  .get(protect, getAllTasks)
  .post(protect, createTask);

// 2. Add new route for completing a task
router.route('/:id/complete')
  .post(protect, completeTask);

// Routes for updating and deleting a single task by its ID
router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
