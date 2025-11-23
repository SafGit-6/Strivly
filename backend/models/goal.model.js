const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  // Data Ownership: Links the goal to the user who created it.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Creates a reference to the User model.
  },

  // The title of the goal.
  title: {
    type: String,
    required: [true, 'Goal title is required.'],
    trim: true,
  },
  
  // The current status of the goal, defaults to 'Pending'.
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Completed'],
    default: 'Pending', 
  },

  // The category of the goal, restricted to a predefined list.
  category: {
    type: String,
    required: [true, 'Category is required.'],
    enum: ['Personal', 'Work', 'Social', 'Household', 'Learning', 'Leisure'],
  },

  // An optional, longer description of the goal.
  description: {
    type: String,
    trim: true,
  },
  
  // The target completion date for the goal.
  deadline: {
    type: Date,
    required: [true, 'Deadline is required.'],
  },

}, {
  // This option automatically adds `createdAt` and `updatedAt` fields,
  // fulfilling your requirement for a `createdAt` date.
  timestamps: true 
});

const Goal = mongoose.model('Goal', GoalSchema);

module.exports = Goal;