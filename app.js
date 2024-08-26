// Import required modules
const express = require('express');
const schoolRoutes = require('./routes/index'); // Make sure this path is correct
require('dotenv').config();

// Initialize Express app
const app = express();

// Set the port for the server to run on
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Use the school routes
// Note: Using '/' means these routes will be available at the root URL
// If you want them under /api, change this to app.use('/api', schoolRoutes);
app.use('/', schoolRoutes);

// 404 Error Handler
// This middleware will catch any requests to routes that don't exist
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global Error Handler
// This middleware will catch any errors thrown in the application
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected error occurred',
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// For testing purposes, export the app
module.exports = app;