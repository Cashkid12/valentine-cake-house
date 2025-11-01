import express from 'express';
import Cake from '../models/Cake.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'staff'));

// Get low stock items
router.get('/low-stock', async (req, res) => {
  try {
    const lowStockCakes = await Cake.find({
      $expr: { $lte: ['$stockQuantity', '$lowStockThreshold'] }
    });

    res.json(lowStockCakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update stock quantity
router.patch('/:id/stock', async (req, res) => {
  try {
    const { stockQuantity } = req.body;
    const cake = await Cake.findByIdAndUpdate(
      req.params.id,
      { stockQuantity },
      { new: true }
    );

    res.json(cake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk stock update
router.patch('/bulk-stock', async (req, res) => {
  try {
    const { updates } = req.body; // [{id, stockQuantity}, ...]
    
    const bulkOperations = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: { stockQuantity: update.stockQuantity }
      }
    }));

    await Cake.bulkWrite(bulkOperations);
    
    const updatedCakes = await Cake.find({
      _id: { $in: updates.map(u => u.id) }
    });

    res.json(updatedCakes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get inventory analytics
router.get('/analytics', async (req, res) => {
  try {
    const totalCakes = await Cake.countDocuments();
    const outOfStock = await Cake.countDocuments({ stockQuantity: 0 });
    const lowStock = await Cake.countDocuments({
      $expr: { 
        $and: [
          { $gt: ['$stockQuantity', 0] },
          { $lte: ['$stockQuantity', '$lowStockThreshold'] }
        ]
      }
    });
    
    const popularCategories = await Cake.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalCakes,
      outOfStock,
      lowStock,
      inStock: totalCakes - outOfStock,
      popularCategories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;