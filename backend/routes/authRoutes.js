const express = require("express")
const authController = require("../controllers/authController.js");
const router = express.Router();


router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser); 
router.post("/logout", authController.logoutUser);




module.exports = router;
