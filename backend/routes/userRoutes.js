const express = require("express")
const userController = require("../controllers/userController.js");
const router = express.Router();

router.get("/", userController.getUsers); // Get all users
router.get("/:id", userController.getUserById); // Get a user by ID
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser); // Login a user
router.delete("/:id", userController.deleteUser); // Delete a user


module.exports = router;
