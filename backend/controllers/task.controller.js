const Task = require('../models/task.model');
const TaskInstance = require('../models/taskInstance.model'); // 1. Import new model

// @desc    Create a new task (Handles both one-time and recurring)
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    // Destructure all possible fields from the request body
    const {
      title,
      category,
      description,
      isRecurring, // New field for recurrence
      expiresIn, // Used only for one-time tasks
      recurringDetails, // Used only for recurring tasks
      forGoal
    } = req.body;

    // --- Core Validation ---
    if (!title || !category) {
      return res.status(400).json({ message: 'Please provide title and category.' });
    }
    if (typeof isRecurring !== 'boolean') {
      // Default to false if not provided, but validate if it is
      if (isRecurring !== undefined) {
          return res.status(400).json({ message: 'isRecurring must be a boolean (true or false).' });
      }
      // If undefined, we'll treat it as false later
    }

    // --- Prepare Task Data ---
    const taskData = {
      title,
      category,
      description,
      isRecurring: isRecurring || false, // Default to false if undefined
      forGoal: forGoal || null,
      user: req.user.id // Securely get user ID
    };

    // --- Handle One-Time vs Recurring Logic ---
    if (taskData.isRecurring) {  
        // --- Recurring Task Validation ---
        if (!recurringDetails || !recurringDetails.frequency) {
            return res.status(400).json({ message: 'Recurring tasks require recurringDetails with a frequency.' });
        }
        if (recurringDetails.frequency === 'Weekly' && (!recurringDetails.daysOfWeek || recurringDetails.daysOfWeek.length === 0)) {
            return res.status(400).json({ message: 'Weekly recurring tasks require daysOfWeek.' });
        }
        if (recurringDetails.frequency === 'Monthly' && (!recurringDetails.daysOfMonth || recurringDetails.daysOfMonth.length === 0)) {
            return res.status(400).json({ message: 'Monthly recurring tasks require daysOfMonth.' });
        }
        // Assign the validated recurring details
        taskData.recurringDetails = recurringDetails;

    } else {
        // --- One-Time Task Validation & Calculation ---
        if (!expiresIn) {
            return res.status(400).json({ message: 'One-time tasks require an expiresIn value ("1day", "1week", "1month").' });
        }
        let expiresAt;
        const now = new Date();
        switch (expiresIn) {
            case '1day':
                // Correct way to add days without modifying 'now' in place for subsequent calculations if needed
                expiresAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                break;
            case '1week':
                expiresAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
                break;
            case '1month':
                expiresAt = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
                break;
            default:
                return res.status(400).json({ message: 'Invalid expiresIn value. Use "1day", "1week", or "1month".' });
        }
        // Assign the calculated expiration date
        taskData.expiresAt = expiresAt;
    }

    // --- Create and Save ---
    const newTask = new Task(taskData);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);

  } catch (error) {
    // Catch Mongoose validation errors specifically if needed
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation failed.', errors: error.errors });
    }
    console.error('Task creation error:', error); // Log unexpected errors
    res.status(500).json({ message: 'Server error creating task.', error: error.message });
  }
};

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).populate('forGoal', 'title').sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tasks.', error: error.message });
  }
};

// @desc    Update a specific task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    // ✅ Ownership Check
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized.' });
    }
    // Note: Add logic here later if needed to recalculate expiresAt if expiresIn changes,
    // or validate recurringDetails if isRecurring changes.
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); // Ensure validators run on update
    res.status(200).json(updatedTask);
  } catch (error) {
     if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation failed.', errors: error.errors });
    }
    console.error('Task update error:', error);
    res.status(500).json({ message: 'Server error updating task.', error: error.message });
  }
};

// 2. NEW FUNCTION: Logic for completing a task
// @desc    Complete a specific task
// @route   POST /api/tasks/:id/complete
const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized.' });
    }

    if (task.isRecurring) {
      // --- Logic for RECURRING task ---
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of the day

      // Check if this instance is already completed
      const existingInstance = await TaskInstance.findOne({
        task: task._id,
        dateCompleted: today,
      });

      if (existingInstance) {
        return res.status(200).json({ message: 'Task instance already completed for today.' });
      }

      const newInstance = new TaskInstance({
        task: task._id,
        user: req.user.id,
        dateCompleted: today,
      });
      await newInstance.save();

      return res.status(201).json({ message: 'Recurring task instance marked as complete.' });
    } 
    else {
      // --- Logic for ONE-TIME task ---
      task.status = 'Completed';
      const updatedTask = await task.save();
      return res.status(200).json(updatedTask);
    }
  } 
  catch (error) {
    // Handle potential duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ message: "Task instance already completed for today." });
    }
    return res.status(500).json({ message: 'Server error completing task.', error: error.message });
  }
};

// 3. UPDATED FUNCTION: Logic for deleting a task
// @desc    Delete a specific task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized.' });
    }

    // Also delete all associated instances from the logbook
    await TaskInstance.deleteMany({ task: task._id });
    
    // Now delete the task itself
    await task.deleteOne();
    
    res.status(200).json({ id: req.params.id, message: 'Task and all its instances removed.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting task.', error: error.message });
  }
};


module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  completeTask,
  deleteTask
};