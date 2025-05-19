const Customer = require('../models/customer');

const CustomerController = {
  async getAll(req, res) {
    try {
      const customers = await Customer.findAll();
      res.json(customers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer)
        return res.status(404).json({ message: 'Customer not found' });
      res.json(customer);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      // Generate account number if not provided
      if (!req.body.account_number) {
        const timestamp = Date.now();
        req.body.account_number = `CUST-${timestamp}`;
      }

      // Set default values
      req.body.totalAmount = req.body.totalAmount || '0';

      const customer = await Customer.create(req.body);
      res.status(201).json(customer);
    } catch (err) {
      console.error('Error creating customer:', err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
          message: 'Account number already exists. Please try again.',
        });
      } else if (err.name === 'SequelizeValidationError') {
        res.status(400).json({
          message: 'Please check all required fields are filled correctly.',
        });
      } else {
        res.status(500).json({
          message: 'An error occurred while creating the customer.',
        });
      }
    }
  },

  async update(req, res) {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer)
        return res.status(404).json({ message: 'Customer not found' });

      await customer.update(req.body);
      res.json(customer);
    } catch (err) {
      console.error('Error updating customer:', err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
          message: 'Account number already exists. Please try a different one.',
        });
      } else if (err.name === 'SequelizeValidationError') {
        res.status(400).json({
          message: 'Please check all required fields are filled correctly.',
        });
      } else {
        res.status(500).json({
          message: 'An error occurred while updating the customer.',
        });
      }
    }
  },

  async delete(req, res) {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer)
        return res.status(404).json({ message: 'Customer not found' });
      await customer.destroy();
      res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Add a method to check if account number exists
  async checkAccountNumber(req, res) {
    try {
      const { account_number } = req.params;
      const customer = await Customer.findOne({ where: { account_number } });
      if (!customer) {
        return res.status(404).json({ message: 'Account number not found' });
      }
      res.json(customer);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async updateTotalAmount(req, res) {
    try {
      const { account_number, amount } = req.body;
      const customer = await Customer.findOne({ where: { account_number } });

      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      // Convert existing totalAmount to number, handle null/undefined case
      const currentTotal = parseFloat(customer.totalAmount || '0');
      const newTotal = (currentTotal + parseFloat(amount)).toFixed(2);

      await customer.update({ totalAmount: newTotal });
      res.json(customer);
    } catch (err) {
      console.error('Error updating customer total amount:', err);
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = CustomerController;
