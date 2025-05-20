const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();

// Import all routes
const userRoute = require('./routes/userRoute.js');
const authRoute = require('./routes/authRoute.js');
const emailRoute = require('./routes/emailRoute.js');
const productRoute = require('./routes/productRoute.js');
const discountRoute = require('./routes/discountRoute.js');
const customerRoute = require('./routes/customerRoute.js');
const payrollRoute = require('./routes/payrollRoute.js');
const salesRoute = require('./routes/salesRoute');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/email', emailRoute);
app.use('/api/products', productRoute);
app.use('/api/discounts', discountRoute);
app.use('/api/customers', customerRoute);
app.use('/api/payrolls', payrollRoute);
app.use('/api/sales', salesRoute);

// Database configuration
const db = require('./models/main');
db.sequelize
  .sync()
  .then(() => console.log('Database synchronized successfully'))
  .catch((err) => console.error('Failed to sync database:', err.message));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
