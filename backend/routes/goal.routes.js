const express = require('express');
const router = express.Router();
const { createGoal, getAllGoals, updateGoal, deleteGoal } = require('../controllers/goal.controller');
const protect = require('../middleware/auth.middleware');

// All of these routes are protected and require a valid token.
// The 'protect' middleware runs before any of the controller functions.

// Route to get all goals and create a new goal
router.route('/')
  .get(protect, getAllGoals)
  .post(protect, createGoal);

// Routes to update and delete a specific goal by its ID
router.route('/:id')
  .put(protect, updateGoal)
  .delete(protect, deleteGoal);

module.exports = router;