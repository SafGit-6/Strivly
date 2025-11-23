const express = require('express');
const router = express.Router();
const TaskInstance = require('../models/taskInstance.model');
const protect = require('../middleware/auth.middleware');

// @desc    Get all completed task instances for the logged-in user
// @route   GET /api/task-instances
router.get('/', protect, async (req, res) => {
  try {
    const instances = await TaskInstance.find({ user: req.user.id });
    res.status(200).json(instances);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching task instances.' });
  }
});

module.exports = router;