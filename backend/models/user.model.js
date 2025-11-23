const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    // Password is not required if signing up with Google
    required: function() { return !this.googleId; },
  },
  displayName: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple documents to have a null value
  },
}, {
  timestamps: true
});

// Hash password before saving a new local user
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new) and is not a Google user
  if (!this.isModified('password') || this.googleId) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords for login
UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;