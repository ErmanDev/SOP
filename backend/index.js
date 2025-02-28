require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/sequelize.js');

const userRoute = require('./routes/userRoutes.js');
const userRoleRoute = require('./routes/userRoleRoutes.js');
const authRoute = require('./routes/authRoutes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow only requests from the frontend
const allowedOrigins = [process.env.FRONTEND_URL || 'https://agropro-agritech-hr-management.vercel.app/'];

app.use(cors({
    origin: allowedOrigins,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));

app.use(express.json());

// ✅ Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'success', message: 'Backend is running!' });
});

// ✅ API Routes
app.use('/api/users', userRoute);
app.use('/api/userRoles', userRoleRoute);
app.use('/api/auth', authRoute);

// ✅ Handle 404 errors for unknown routes
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ✅ Sync database and start server
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
