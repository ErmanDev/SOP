const { sequelize } = require('./config/sequelize.js');
const express = require('express');
const userRoute = require( './routes/userRoutes.js');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.use('/api/users', userRoute);


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
