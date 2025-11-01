import express from 'express';
import Cake from '../models/Cake.js';

const router = express.Router();

// Get all cakes - FIXED VERSION
router.get('/', async (req, res) => {
  try {
    const { category, flavor, featured, available } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (flavor) filter.flavor = flavor;
    if (featured) filter.featured = featured === 'true';
    if (available !== undefined) filter.available = available === 'true';
    
    const cakes = await Cake.find(filter).sort({ createdAt: -1 });
    
    // Return the format that Shop.jsx expects
    res.json({
      success: true,
      cakes
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get featured cakes
router.get('/featured', async (req, res) => {
  try {
    const cakes = await Cake.find({ featured: true, available: true }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      cakes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single cake
router.get('/:id', async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    
    if (!cake) {
      return res.status(404).json({
        success: false,
        message: 'Cake not found'
      });
    }

    res.json({
      success: true,
      cake
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;