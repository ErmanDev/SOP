const express = require("express")
const userController = require("../controllers/userController.js");
const router = express.Router();

router.get("/", userController.getUsers); 
router.get("/:id", userController.getUserById); 
router.get('/countUsers', userController.countUsers);
router.get('/countTechnicians', userController.countTechnicians);
router.get('/countManagers', userController.countManagers);
router.post("/login", userController.loginUser); 
router.delete("/:id", userController.deleteUser); 




module.exports = router;
