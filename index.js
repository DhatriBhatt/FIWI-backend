const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Initialize the app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Enable CORS for cross-origin requests
app.use(cors());

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const conn = mongoose.connection;

// Handle connection errors
conn.on('error', (err) => {
  console.error('Failed to connect to MongoDB:', err);
});

// Log successful connection
conn.once('open', () => {
  console.log('Connected to MongoDB');
});

// Import routes
const adminUserRoutes = require('./routes/adminUsers');
const eventRoutes = require('./routes/events'); // Ensure this is the correct path to the events route file
const userRoutes = require('./routes/users');

// Register routes
app.use('/api/admin', adminUserRoutes);
app.use('/api/events', eventRoutes); // This should match the endpoint used in your requests
app.use('/api/users', userRoutes);

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Capstone Project API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
