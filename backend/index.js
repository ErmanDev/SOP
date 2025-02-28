const { sequelize } = require('./config/sequelize.js');
const express = require('express');
const cors = require('cors'); // Add this line
const userRoute = require( './routes/userRoutes.js');
const userRoleRoute = require('./routes/userRoleRoutes.js');
const authRoute = require('./routes/authRoutes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Add CORS middleware before routes
app.use(cors());
app.use(express.json());

//testing backend
app.use("/", (req, res) => {
  res.json({ message: "Welcome to the backend!" });
});

app.use('/api/users', userRoute);
app.use('/api/userRoles', userRoleRoute);
app.use('/api/auth', authRoute);

(async () => {
  try {
    await sequelize.sync({ alter: true }); 
  

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error syncing database:", error);
  }
})();
