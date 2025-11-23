const Goal = require('../models/goal.model');
const Task = require('../models/task.model'); // 1. Import Task model
const TaskInstance = require('../models/taskInstance.model'); // 2. Import TaskInstance model
const mongoose = require('mongoose');

// @desc    Create a new goal
// @route   POST /api/goal
const createGoal = async (req, res) => {
  try {
    const { title, category, description, deadline } = req.body;

    // --- Validation ---
    if (!title || !category || !deadline) {
      return res.status(400).json({ message: 'Please provide title, category, and deadline.' });
    }

    const newGoal = new Goal({
      title,
      category,
      description,
      deadline,
      user: req.user.id // ✅ Securely get the user ID from the authenticated request
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating goal.', error: error.message });
  }
};

// @desc    Get all goals for the logged-in user
// @route   GET /api/goal

// --- Helper Function ---
// This function calculates the "Total Instances Expected" for a recurring task
// It loops from the task's creation date to today, counting all valid occurrences
const calculateExpectedInstances = (createdAt, today, recurringDetails) => {
  let count = 0;
  // Start from the creation date, normalized
  let currentDate = new Date(createdAt);
  currentDate.setHours(0, 0, 0, 0);

  // Loop until we pass today
  while (currentDate <= today) {
    const { frequency, daysOfWeek, daysOfMonth } = recurringDetails;

    if (frequency === 'Daily') {
      count++;
    } else if (frequency === 'Weekly') {
      if (daysOfWeek.includes(currentDate.getDay())) {
        count++;
      }
    } else if (frequency === 'Monthly') {
      if (daysOfMonth.includes(currentDate.getDate())) {
        count++;
      }
    }
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return count;
};


// @desc    Get all goals for the logged-in user
// @route   GET /api/goal
const getAllGoals = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    // Get today's date, normalized to the start
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // --- 1. Fetch Data in Parallel ---
    // We need two sets of data:
    // 1. All goals, with their associated tasks
    // 2. The *entire* logbook of completed instances for this user
    const [goalsWithTasks, allUserInstances] = await Promise.all([
      // Call 1: Get all goals and join their tasks
      Goal.aggregate([
        { $match: { user: userId } },
        {
          $lookup: {
            from: 'tasks', // MongoDB collection name for tasks
            localField: '_id',
            foreignField: 'forGoal',
            as: 'tasks' // Attach the array of tasks to each goal
          }
        },
        { $sort: { createdAt: -1 } }
      ]),
      // Call 2: Get the user's entire logbook
      TaskInstance.find({ user: userId }).lean() // .lean() for faster JS processing
    ]);

    // --- 2. Process Data in JavaScript ---
    // This is where we implement your dynamic logic
    const finalGoals = goalsWithTasks.map(goal => {
      let totalInstancesExpected = 0;
      let totalInstancesCompleted = 0;

      // Loop over every task associated with this goal
      goal.tasks.forEach(task => {
        const createdAt = new Date(task.createdAt);

        if (!task.isRecurring) {
          // --- Logic for One-Time Tasks ---
          totalInstancesExpected += 1;
          if (task.status === 'Completed') {
            totalInstancesCompleted += 1;
          }
        } else {
          // --- Logic for Recurring Tasks ---
          
          // A) Calculate Expected (using our helper function)
          totalInstancesExpected += calculateExpectedInstances(
            createdAt,
            today,
            task.recurringDetails
          );

          // B) Calculate Completed (by searching the logbook)
          const completedCount = allUserInstances.filter(
            instance => instance.task.toString() === task._id.toString()
          ).length;
          totalInstancesCompleted += completedCount;
        }
      });

      // --- 3. Calculate Final Score & Date Properties ---
      const productivityScore =
        totalInstancesExpected > 0
          ? Math.round((totalInstancesCompleted / totalInstancesExpected) * 100)
          : 0; // Avoid division by zero

      // --- 4. Calculate Date Properties (from our previous solution) ---
      const deadline = new Date(goal.deadline);
      deadline.setHours(0, 0, 0, 0);
      
      const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric'
        }).format(new Date(date));
      };

      const timeDiff = deadline.getTime() - today.getTime();
      const remainingDays = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
      const dateRange = `${formatDate(goal.createdAt)} - ${formatDate(deadline)}`;

      // --- 5. Return the final object for the frontend ---
      return {
        ...goal,
        tasks: undefined, // Remove the large tasks array
        productivityScore,
        remainingDays,
        dateRange,
      };
    });

    res.status(200).json(finalGoals);

  } catch (error) {
    console.error("Error in dynamic getAllGoals:", error);
    res.status(500).json({ message: 'Server error fetching goals.', error: error.message });
  }
};

// @desc    Update a goal
// @route   PUT /api/goal/:id
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found.' });
    }

    // Ensure the user owns the goal they are trying to update
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized.' });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating goal.', error: error.message });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goal/:id
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found.' });
    }

    // Ensure the user owns the goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized.' });
    }
    
    await goal.deleteOne(); // Use deleteOne() instead of remove()
    res.status(200).json({ message: 'Goal removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting goal.', error: error.message });
  }
};

module.exports = {
  createGoal,
  getAllGoals,
  updateGoal,
  deleteGoal,
};