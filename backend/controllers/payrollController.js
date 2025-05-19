const db = require('../models/main');
const Payroll = db.Payroll;
const { Op } = require('sequelize');

// Get all payroll entries
exports.getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(payrolls);
  } catch (error) {
    console.error('Error fetching payrolls:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch payrolls', error: error.message });
  }
};

// Create a new payroll entry
exports.createPayroll = async (req, res) => {
  try {
    const { name, position, status, salary } = req.body;

    // Validate required fields
    if (!name || !position || !status || !salary) {
      return res.status(400).json({
        message: 'Missing required fields',
        details: { name, position, status, salary },
      });
    }

    // Check if employee already exists in payroll
    const existingPayroll = await Payroll.findOne({
      where: { name: name },
    });

    if (existingPayroll) {
      return res.status(400).json({
        message: 'Employee already exists in payroll',
        error: 'Duplicate entry',
      });
    }

    // Generate employee ID (EMP + 3 digit number)
    const lastPayroll = await Payroll.findOne({
      order: [['id', 'DESC']],
    });

    let newId = 'EMP001';
    if (lastPayroll) {
      const lastNumber = parseInt(lastPayroll.id.slice(3));
      newId = `EMP${String(lastNumber + 1).padStart(3, '0')}`;
    }

    const payroll = await Payroll.create({
      id: newId,
      name,
      position,
      status,
      salary: parseFloat(salary),
    });

    res.status(201).json({
      message: 'Payroll entry created successfully',
      payroll,
    });
  } catch (error) {
    console.error('Error creating payroll:', error);
    res
      .status(500)
      .json({ message: 'Failed to create payroll', error: error.message });
  }
};

// Update a payroll entry
exports.updatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, status, salary } = req.body;

    const payroll = await Payroll.findByPk(id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll entry not found' });
    }

    await payroll.update({
      name,
      position,
      status,
      salary: parseFloat(salary),
    });

    res.status(200).json({
      message: 'Payroll entry updated successfully',
      payroll,
    });
  } catch (error) {
    console.error('Error updating payroll:', error);
    res
      .status(500)
      .json({ message: 'Failed to update payroll', error: error.message });
  }
};

// Delete a payroll entry
exports.deletePayroll = async (req, res) => {
  try {
    const { id } = req.params;

    const payroll = await Payroll.findByPk(id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll entry not found' });
    }

    await payroll.destroy();
    res.status(200).json({ message: 'Payroll entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting payroll:', error);
    res
      .status(500)
      .json({ message: 'Failed to delete payroll', error: error.message });
  }
};

// Search payroll entries
exports.searchPayrolls = async (req, res) => {
  try {
    const { query } = req.query;
    const payrolls = await Payroll.findAll({
      where: {
        [Op.or]: [
          { id: { [Op.like]: `%${query}%` } },
          { name: { [Op.like]: `%${query}%` } },
          { position: { [Op.like]: `%${query}%` } },
        ],
      },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(payrolls);
  } catch (error) {
    console.error('Error searching payrolls:', error);
    res
      .status(500)
      .json({ message: 'Failed to search payrolls', error: error.message });
  }
};
