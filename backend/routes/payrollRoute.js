const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');

// Get all payrolls
router.get('/', payrollController.getAllPayrolls);

// Create a new payroll entry
router.post('/', payrollController.createPayroll);

// Update a payroll entry
router.put('/:id', payrollController.updatePayroll);

// Delete a payroll entry
router.delete('/:id', payrollController.deletePayroll);

// Search payrolls
router.get('/search', payrollController.searchPayrolls);

module.exports = router;
