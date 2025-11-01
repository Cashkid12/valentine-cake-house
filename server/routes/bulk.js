import express from 'express';
import Cake from '../models/Cake.js';
import Order from '../models/Order.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

// Bulk update cake prices
router.patch('/cakes/prices', async (req, res) => {
  try {
    const { percentage, operation, category } = req.body; // operation: 'increase' or 'decrease'
    
    let filter = {};
    if (category && category !== 'all') {
      filter.category = category;
    }

    const multiplier = operation === 'increase' ? (1 + percentage / 100) : (1 - percentage / 100);
    
    const result = await Cake.updateMany(
      filter,
      [{ $set: { price: { $multiply: ['$price', multiplier] } } }]
    );

    res.json({
      message: `Successfully updated ${result.modifiedCount} cakes`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk update cake availability
router.patch('/cakes/availability', async (req, res) => {
  try {
    const { available, category, ids } = req.body;
    
    let filter = {};
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (ids && ids.length > 0) {
      filter._id = { $in: ids };
    }

    const result = await Cake.updateMany(
      filter,
      { available }
    );

    res.json({
      message: `Successfully updated ${result.modifiedCount} cakes`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk update order statuses
router.patch('/orders/status', async (req, res) => {
  try {
    const { status, orderIds } = req.body;
    
    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { status }
    );

    res.json({
      message: `Successfully updated ${result.modifiedCount} orders`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk delete cakes
router.delete('/cakes', async (req, res) => {
  try {
    const { ids } = req.body;
    
    const result = await Cake.deleteMany({
      _id: { $in: ids }
    });

    res.json({
      message: `Successfully deleted ${result.deletedCount} cakes`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk feature/unfeature cakes
router.patch('/cakes/feature', async (req, res) => {
  try {
    const { featured, ids } = req.body;
    
    const result = await Cake.updateMany(
      { _id: { $in: ids } },
      { featured }
    );

    res.json({
      message: `Successfully updated ${result.modifiedCount} cakes`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;