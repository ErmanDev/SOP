const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/countUser', userController.countUser);
router.get('/getEmployee', userController.getEmployeeDetails);
router.put('/updateEmployee/:user_id', userController.updateEmployee);
router.post('/registerEmployee', userController.registerEmployee);

module.exports = router;
