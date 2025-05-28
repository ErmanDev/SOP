const Sale = require('../models/sale');
const Customer = require('../models/customer');
const Order = require('../models/order');
const Return = require('../models/return');
const db = require('../models/main');
const { Op, fn, col, literal } = require('sequelize');

const SalesController = {
  async getDashboardStats(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      // Get total revenue (all time)
      const totalRevenue =
        (await db.Orders.sum('totalAmount', {
          where: {
            status: 'delivered',
          },
        })) || 0;

      // Get today's sales
      const todaySales =
        (await db.Orders.sum('totalAmount', {
          where: {
            status: 'delivered',
            createdAt: {
              [Op.gte]: today,
            },
          },
        })) || 0;

      // Get yesterday's sales for comparison
      const yesterdaySales =
        (await db.Orders.sum('totalAmount', {
          where: {
            status: 'delivered',
            createdAt: {
              [Op.gte]: yesterday,
              [Op.lt]: today,
            },
          },
        })) || 0;

      // Calculate sales change percentage
      const salesTodayChange = yesterdaySales
        ? ((todaySales - yesterdaySales) / yesterdaySales) * 100
        : 0;

      // Get last month's revenue for comparison
      const lastMonthRevenue =
        (await db.Orders.sum('totalAmount', {
          where: {
            status: 'delivered',
            createdAt: {
              [Op.gte]: lastMonth,
              [Op.lt]: today,
            },
          },
        })) || 0;

      // Calculate revenue change percentage
      const revenueChange = lastMonthRevenue
        ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

      // Get customer stats
      console.log('Fetching customer stats...');
      const totalCustomers = await db.Customers.count();
      console.log('Total customers:', totalCustomers);

      // Get customer membership stats
      const silverCustomers = await db.Customers.count({
        where: { membership: 'Silver' },
      });
      console.log('Silver customers:', silverCustomers);

      const goldCustomers = await db.Customers.count({
        where: { membership: 'Gold' },
      });
      console.log('Gold customers:', goldCustomers);

      const platinumCustomers = await db.Customers.count({
        where: { membership: 'Platinum' },
      });
      console.log('Platinum customers:', platinumCustomers);

      // Get last month's customer count for comparison
      const lastMonthCustomers = await db.Customers.count({
        where: {
          createdAt: {
            [Op.gte]: lastMonth,
          },
        },
      });
      const customerChange = lastMonthCustomers
        ? ((totalCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
        : 0;

      // Get order stats
      const pendingOrders = await db.Orders.count({
        where: {
          status: {
            [Op.in]: ['pending', 'out_for_delivery'],
          },
        },
      });

      const lastMonthPendingOrders = await db.Orders.count({
        where: {
          status: {
            [Op.in]: ['pending', 'out_for_delivery'],
          },
          createdAt: {
            [Op.gte]: lastMonth,
          },
        },
      });
      const orderChange = lastMonthPendingOrders
        ? ((pendingOrders - lastMonthPendingOrders) / lastMonthPendingOrders) *
          100
        : 0;

      // Get returns stats
      const totalReturns = (await db.Returns.sum('amount')) || 0;
      const lastMonthReturns =
        (await db.Returns.sum('amount', {
          where: {
            createdAt: {
              [Op.gte]: lastMonth,
            },
          },
        })) || 0;
      const returnChange = lastMonthReturns
        ? ((totalReturns - lastMonthReturns) / lastMonthReturns) * 100
        : 0;

      const responseData = {
        totalRevenue: `₱${totalRevenue.toFixed(2)}`,
        salesToday: `₱${todaySales.toFixed(2)}`,
        totalCustomers,
        pendingOrders,
        totalReturns: `₱${totalReturns.toFixed(2)}`,
        revenueChange,
        salesTodayChange,
        customerChange,
        orderChange,
        returnChange,
        customerStats: {
          total: totalCustomers,
          silver: silverCustomers,
          gold: goldCustomers,
          platinum: platinumCustomers,
        },
      };

      console.log('Sending dashboard data:', responseData);
      res.json(responseData);
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      res.status(500).json({ message: error.message });
    }
  },

  async getChartData(req, res) {
    try {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const today = new Date();
      const sixMonthsAgo = new Date(
        today.getFullYear(),
        today.getMonth() - 5,
        1
      );

      // Get sales data for last 6 months
      const salesData = await db.Orders.findAll({
        attributes: [
          [fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'month'],
          [fn('SUM', col('totalAmount')), 'total'],
        ],
        where: {
          status: 'delivered',
          createdAt: {
            [Op.gte]: sixMonthsAgo,
            [Op.lte]: today,
          },
        },
        group: [fn('DATE_FORMAT', col('createdAt'), '%Y-%m')],
        order: [[col('month'), 'ASC']],
        raw: true,
      });

      console.log('Raw sales data:', salesData);

      // Get customer data for last 6 months
      const customerData = await db.Customers.findAll({
        attributes: [
          [fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'month'],
          [fn('COUNT', literal('*')), 'total'],
        ],
        where: {
          createdAt: {
            [Op.gte]: sixMonthsAgo,
            [Op.lte]: today,
          },
        },
        group: [fn('DATE_FORMAT', col('createdAt'), '%Y-%m')],
        order: [[col('month'), 'ASC']],
        raw: true,
      });

      console.log('Raw customer data:', customerData);

      // Initialize arrays for the last 6 months
      const labels = [];
      const salesByMonth = new Array(6).fill(0);
      const customersByMonth = new Array(6).fill(0);

      // Fill in the labels and initialize data arrays
      for (let i = 0; i < 6; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1);
        const monthStr = months[date.getMonth()];
        const yearMonth = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}`;
        labels.push(monthStr);

        // Find and assign sales data
        const monthSales = salesData.find((s) => s.month === yearMonth);
        if (monthSales) {
          salesByMonth[i] = parseFloat(monthSales.total) || 0;
        }

        // Find and assign customer data
        const monthCustomers = customerData.find((c) => c.month === yearMonth);
        if (monthCustomers) {
          customersByMonth[i] = parseInt(monthCustomers.total) || 0;
        }
      }

      console.log('Processed data:', {
        labels,
        salesByMonth,
        customersByMonth,
      });

      const datasets = [
        {
          label: 'Sales',
          data: salesByMonth,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 3,
          fill: true,
          tension: 0.5,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Total Customers',
          data: customersByMonth,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 3,
          fill: true,
          tension: 0.5,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ];

      res.json({ labels, datasets });
    } catch (error) {
      console.error('Error getting chart data:', error);
      res.status(500).json({ message: error.message });
    }
  },

  async createSale(req, res) {
    const t = await db.sequelize.transaction();

    try {
      const { amount, customerId, items } = req.body;
      console.log('Received items:', items);

      // Create order first
      const order = await db.Orders.create(
        {
          customerId,
          totalAmount: amount,
          status: 'delivered',
          items: items,
        },
        { transaction: t }
      );

      // Update product stock quantities
      for (const item of items) {
        console.log('Processing item:', item);

        // Add 'PROD-' prefix if it doesn't exist
        const productId = item.productId.startsWith('PROD-')
          ? item.productId
          : `PROD-${item.productId}`;
        console.log('Looking for product with ID:', productId);

        const product = await db.Products.findOne({
          where: { product_id: productId },
          transaction: t,
        });

        if (!product) {
          console.error('Product not found:', productId);
          throw new Error(`Product with ID ${productId} not found`);
        }

        console.log('Found product:', {
          id: product.product_id,
          name: product.name,
          currentStock: product.stock_quantity,
        });

        if (product.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        await product.update(
          {
            stock_quantity: product.stock_quantity - item.quantity,
          },
          { transaction: t }
        );

        console.log('Updated stock for product:', {
          id: product.product_id,
          name: product.name,
          oldStock: product.stock_quantity,
          newStock: product.stock_quantity - item.quantity,
        });
      }

      await t.commit();
      console.log('Transaction committed successfully');

      res.status(201).json({
        message: 'Sale created successfully',
        order,
      });
    } catch (error) {
      await t.rollback();
      console.error('Error creating sale:', error);
      res.status(500).json({ message: error.message });
    }
  },

  async getAllSales(req, res) {
    try {
      const sales = await db.Orders.findAll({
        where: {
          status: 'delivered',
        },
        include: [
          {
            model: db.Customers,
            attributes: ['name'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      const formattedSales = sales.map((sale) => ({
        id: sale.id,
        customerName: sale.Customer ? sale.Customer.name : 'Walk-in Customer',
        totalItems: sale.items ? JSON.parse(sale.items).length : 0,
        totalAmount: sale.totalAmount,
        createdAt: sale.createdAt,
      }));

      res.json(formattedSales);
    } catch (error) {
      console.error('Error fetching sales:', error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = SalesController;
