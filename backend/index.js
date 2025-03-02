const { sequelize } = require('./config/sequelize.js');
const express = require('express');
const cors = require('cors'); // Add this line
const userRoute = require( './routes/userRoutes.js');
const authRoute = require('./routes/authRoutes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Add CORS middleware before routes
app.use(express.json());
app.use(cors()); 
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);

(async () => {
  try {
    await sequelize.sync({ alter: true }); 
    console.log("✅ Database & tables synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error syncing database:", error);
  }
})();
