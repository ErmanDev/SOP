const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; // Changed to 5000 to match your frontend requests

// Import routes
const userRoutes = require('./src/routes/userRoute');
// const userTypeRoute = require('./src/routes/');


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.query);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', require('./src/routes/authenticationRoute'));
app.use('/api/userRoles', userRoleRoutes);


// Test endpoint
app.get('/', (req, res) => {
  res.status(200).send("Hello World");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const db = require('./models/main');
db.sequelize.sync()
  .then(() => console.log("Database synchronized successfully"))
  .catch(err => console.error("Failed to sync database:", err.message));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
