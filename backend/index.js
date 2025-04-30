const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

const userRoute = require('./routes/userRoute.js');
const authRoute = require('./routes/authRoute.js');

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
//routes

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);

const db = require('./models/main');
db.sequelize
  .sync()
  .then(() => console.log('Database synchronized successfully'))
  .catch((err) => console.error('Failed to sync database:', err.message));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
