import express from 'express';
import Order from '../models/Order.js';
import Cake from '../models/Cake.js';
import CustomCakeRequest from '../models/CustomCakeRequest.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

// Sales overview
router.get('/sales-overview', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'week':
        dateFilter = { 
          createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } 
        };
        break;
      case 'month':
        dateFilter = { 
          createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } 
        };
        break;
      case 'year':
        dateFilter = { 
          createdAt: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) } 
        };
        break;
    }

    const orders = await Order.find(dateFilter);
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Popular products
    const popularProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $match: dateFilter },
      { $group: { 
        _id: '$items.cake', 
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }},
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      { $lookup: {
        from: 'cakes',
        localField: '_id',
        foreignField: '_id',
        as: 'cake'
      }},
      { $unwind: '$cake' }
    ]);

    res.json({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      popularProducts,
      period
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Revenue trends
router.get('/revenue-trends', async (req, res) => {
  try {
    const revenueByMonth = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: {
        _id: { 
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json(revenueByMonth);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Customer analytics
router.get('/customer-analytics', async (req, res) => {
  try {
    const customerStats = await Order.aggregate([
      { $group: {
        _id: '$phone',
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalAmount' },
        firstOrder: { $min: '$createdAt' },
        lastOrder: { $max: '$createdAt' }
      }},
      { $project: {
        phone: '$_id',
        totalOrders: 1,
        totalSpent: 1,
        firstOrder: 1,
        lastOrder: 1,
        customerType: {
          $cond: [
            { $gte: ['$totalOrders', 3] },
            'Regular',
            { $cond: [{ $eq: ['$totalOrders', 1] }, 'New', 'Returning'] }
          ]
        }
      }},
      { $sort: { totalSpent: -1 } }
    ]);

    const customerTypes = customerStats.reduce((acc, customer) => {
      acc[customer.customerType] = (acc[customer.customerType] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalCustomers: customerStats.length,
      customerTypes,
      topCustomers: customerStats.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export reports
router.get('/export-orders', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filter = {};
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(filter)
      .populate('items.cake')
      .sort({ createdAt: -1 });

    // Convert to CSV format
    const csvData = orders.map(order => ({
      'Order ID': order._id.toString().slice(-6),
      'Customer': order.customerName,
      'Phone': order.phone,
      'Location': order.deliveryLocation,
      'Amount': order.totalAmount,
      'Status': order.status,
      'Date': order.createdAt.toISOString().split('T')[0],
      'Items': order.items.map(item => `${item.quantity}x ${item.cake?.name || 'Custom'}`).join(', ')
    }));

    res.json(csvData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;