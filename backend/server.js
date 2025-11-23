const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

require('./models/taskInstance.model'); // 1. Add this line to register the model

// Route imports
const authRoutes = require('./routes/auth.routes'); 
const taskRoutes = require('./routes/task.routes');
const goalRoutes = require('./routes/goal.routes');
const exApiRoutes = require('./routes/exApi.routes');
const taskInstanceRoutes = require('./routes/taskInstance.routes');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 7862;

// Middleware
app.use(cors());
app.use(express.json());

// 2. Express Session Middleware (Required for Passport OAuth)
app.use(session({
  secret: 'a_secret_key_for_the_session', // Use a long, random string in production
  resave: false,
  saveUninitialized: false,
}));

// 3. Passport Middleware Initialization
app.use(passport.initialize());
app.use(passport.session());

// 4. Load Passport Strategy Configurations
require('./config/passport')(passport);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes); //  Use auth routes
app.use('/api/task', taskRoutes); // Use task routes
app.use('/api/goal', goalRoutes); // Use goal routes
app.use('/api/external', exApiRoutes); // Route for external API calls
app.use('/api/task-instances', taskInstanceRoutes); //Use task instance routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});