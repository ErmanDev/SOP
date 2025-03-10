const express = require("express");
const userController = require("../controllers/userController.js");  // ✅ CHECK THIS
const router = express.Router();
router.post("/registerEmployee", userController.registerUser);
router.get("/fetchUsers", userController.fetchAllUsers);
router.get("/fetchUserDetails", userController.fetchUserDetails);
router.get("/countUsers", userController.countUsers);
router.get("/countTechnicians", userController.countTechnicians);
router.get("/countManagers", userController.countManagers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
