const Customer = require('../models/customer');

const CustomerController = {
  async getAll(req, res) {
    try {
      const customers = await Customer.findAll();
      res.json(customers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer)
        return res.status(404).json({ error: 'Customer not found' });
      res.json(customer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const customer = await Customer.create(req.body);
      res.status(201).json(customer);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer)
        return res.status(404).json({ error: 'Customer not found' });
      await customer.update(req.body);
      res.json(customer);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer)
        return res.status(404).json({ error: 'Customer not found' });
      await customer.destroy();
      res.json({ message: 'Customer deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = CustomerController;
