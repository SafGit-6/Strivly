const mongoose = require('mongoose');

// This model stores a record of each time a RECURRING task is completed.
const TaskInstanceSchema = new mongoose.Schema({
  // Link to the original task "template"
  task: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Task'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The specific date this instance was completed for
  dateCompleted: {
    type: Date,
    required: true
  }
}, {
  timestamps: true // Stores when this log entry was created
});

// To prevent duplicate entries (e.g., completing the same daily task twice on the same day)
TaskInstanceSchema.index({ task: 1, dateCompleted: 1 }, { unique: true });

const TaskInstance = mongoose.model('TaskInstance', TaskInstanceSchema);
module.exports = TaskInstance;