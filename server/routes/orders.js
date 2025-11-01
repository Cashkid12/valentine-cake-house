import express from 'express';
import Order from '../models/Order.js';
import { sendNewOrderEmail } from '../utils/email.js';

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    
    // Send email notification
    await sendNewOrderEmail(savedOrder);
    
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;