const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  // Data Ownership: Links the task to the user who created it.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  title: {
    type: String,
    required: [true, 'Task title is required.'],
    trim: true,
  },
  
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },

  category: {
    type: String,
    required: [true, 'Category is required.'],
    enum: ['Personal', 'Work', 'Social', 'Household', 'Learning', 'Leisure'],
  },

  description: {
    type: String,
    trim: true,
  },
  
  // --- Fields for One-Time Tasks ---
  expiresAt: { // the date till which the task can be completed , after which it will be deleted.
    type: Date,
    // This field is only required if the task is NOT recurring.
    required: function() { return !this.isRecurring; }
  },

  // --- Fields for Recurring Tasks ---
  isRecurring: {
    type: Boolean,
    default: false,
  },

  recurringDetails: {
    // This entire object is only required if the task IS recurring.
    required: function() { return this.isRecurring; },
    type: {
      frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly'],
        required: true,
      },
      // Array of numbers 0-6 (Sun-Sat). Only required for 'Weekly' frequency.
      daysOfWeek: {
        type: [Number],
        required: function() { return this.frequency === 'Weekly'; }
      },
      // Array of numbers 1-31. Only required for 'Monthly' frequency.
      daysOfMonth: {
        type: [Number],
        required: function() { return this.frequency === 'Monthly'; }
      }
    }
  },

  // Optional link to a parent Goal document.
  forGoal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    default: null,
  },

}, {
  timestamps: true 
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;