import express from 'express';
import Order from '../models/Order.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'staff'));

// Get all customers with order history
router.get('/', async (req, res) => {
  try {
    const customers = await Order.aggregate([
      {
        $group: {
          _id: '$phone',
          customerName: { $first: '$customerName' },
          email: { $first: '$email' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          firstOrder: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' },
          favoriteCategory: { 
            $first: {
              $arrayElemAt: [
                {
                  $map: {
                    input: {
                      $slice: [
                        {
                          $objectToArray: {
                            $arrayToObject: [
                              {
                                $map: {
                                  input: '$items',
                                  as: 'item',
                                  in: {
                                    k: '$$item.cake.category',
                                    v: '$$item.quantity'
                                  }
                                }
                              }
                            ]
                          }
                        },
                        1
                      ]
                    },
                    as: 'cat',
                    in: '$$cat.k'
                  }
                },
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          phone: '$_id',
          customerName: 1,
          email: 1,
          totalOrders: 1,
          totalSpent: 1,
          firstOrder: 1,
          lastOrder: 1,
          favoriteCategory: 1,
          customerType: {
            $cond: [
              { $gte: ['$totalOrders', 3] },
              'Regular',
              { $cond: [{ $eq: ['$totalOrders', 1] }, 'New', 'Returning'] }
            ]
          }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer details with full order history
router.get('/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    
    const customerOrders = await Order.find({ phone })
      .populate('items.cake')
      .sort({ createdAt: -1 });

    if (customerOrders.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const customerInfo = {
      phone,
      customerName: customerOrders[0].customerName,
      email: customerOrders[0].email,
      totalOrders: customerOrders.length,
      totalSpent: customerOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      firstOrder: customerOrders[customerOrders.length - 1].createdAt,
      lastOrder: customerOrders[0].createdAt,
      orders: customerOrders
    };

    res.json(customerInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update customer information
router.patch('/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const { customerName, email, notes } = req.body;

    // Update all orders for this customer
    await Order.updateMany(
      { phone },
      { 
        $set: { 
          customerName,
          email 
        } 
      }
    );

    const updatedOrders = await Order.find({ phone });
    
    res.json({
      message: 'Customer information updated successfully',
      customer: {
        phone,
        customerName,
        email,
        totalOrders: updatedOrders.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer lifetime value analytics
router.get('/:phone/lifetime-value', async (req, res) => {
  try {
    const { phone } = req.params;
    
    const customerData = await Order.aggregate([
      { $match: { phone } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' },
          firstOrderDate: { $min: '$createdAt' },
          lastOrderDate: { $max: '$createdAt' }
        }
      }
    ]);

    if (customerData.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const data = customerData[0];
    const lifetimeInDays = Math.ceil(
      (new Date(data.lastOrderDate) - new Date(data.firstOrderDate)) / (1000 * 60 * 60 * 24)
    );

    res.json({
      totalSpent: data.totalSpent,
      orderCount: data.orderCount,
      averageOrderValue: data.averageOrderValue,
      lifetimeInDays,
      dailySpend: data.totalSpent / Math.max(lifetimeInDays, 1),
      customerSince: data.firstOrderDate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;