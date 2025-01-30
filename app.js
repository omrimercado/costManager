// Import required modules
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

/**
 * @constant {number} PORT - The port number for the server
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const mongoURI = process.env.MONGO_URI;
/**
 * Connect to MongoDB Atlas
 */
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * MongoDB connection events
 */
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB Atlas successfully!');
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Import route files
const reportRoutes = require('./routes/report'); // Adjust path as necessary
const userRoutes = require('./routes/users');   // Adjust path as necessary
const costRoutes = require('./routes/costs');
const aboutRoutes = require('./routes/about');

// Create an Express application
const app = express();

/**
 * Middleware setup
 */
app.use(logger('dev')); // Logs HTTP requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.set('views', path.join(__dirname, 'views'));

/**
 * Set the view engine to Pug
 */
app.set('view engine', 'pug');
app.get('/', (req, res) => {
  res.render('index', { title: 'Final Project' }); // Renders index.pug
});


/**
 * Serve static files
 */
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Use the routes
 */
app.use('/api', reportRoutes);
app.use('/api', userRoutes);
app.use('/api', costRoutes);
app.use('/api',aboutRoutes);
// Catch 404 errors and forward to error handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
/**
 * Start the Express server
 */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Export the app instance
module.exports = app;
