const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customerController');

router.get('/', CustomerController.getAll);
router.get('/:id', CustomerController.getById);
router.post('/create', CustomerController.create);
router.put('/:id', CustomerController.update);
router.delete('/:id', CustomerController.delete);
router.get('/check/:account_number', CustomerController.checkAccountNumber);
router.post('/update-total', CustomerController.updateTotalAmount);

module.exports = router;
