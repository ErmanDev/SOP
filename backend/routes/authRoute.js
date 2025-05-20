const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authenticationController');

router.post('/register', AuthController.Register);
router.post('/login', AuthController.Login);
router.post('/reset-password', AuthController.ResetPassword);
router.post('/change-password', AuthController.ChangePassword);

module.exports = router;
