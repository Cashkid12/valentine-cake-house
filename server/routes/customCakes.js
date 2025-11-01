import express from 'express';
import CustomCakeRequest from '../models/CustomCakeRequest.js';
import { sendCustomRequestEmail } from '../utils/email.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Submit custom cake request with image upload
router.post('/', uploadMultiple, async (req, res) => {
  try {
    const requestData = req.body;
    
    // Add reference image URLs from Cloudinary if files were uploaded
    if (req.files && req.files.length > 0) {
      requestData.referenceImages = req.files.map(file => file.path);
    }

    const request = new CustomCakeRequest(requestData);
    const savedRequest = await request.save();
    
    // Send email notification
    await sendCustomRequestEmail(savedRequest);
    
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all custom cake requests
router.get('/', async (req, res) => {
  try {
    const requests = await CustomCakeRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;