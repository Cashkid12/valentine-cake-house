import express from 'express';
import multer from 'multer';
import Cake from '../models/Cake.js';
import Order from '../models/Order.js';
import CustomCakeRequest from '../models/CustomCakeRequest.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { cloudinary } from '../utils/cloudinary.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Cloudinary upload function
const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'valentine-cake-house',
        format: 'png',
        public_id: `cake-${Date.now()}-${Math.random().toString(36).substring(7)}`
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    
    uploadStream.end(fileBuffer);
  });
};

// Protect all admin routes
router.use(protect);
router.use(authorize('admin', 'staff'));

// Admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 Fetching admin stats for user:', req.user.id);
    
    const totalCakes = await Cake.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomRequests = await CustomCakeRequest.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const pendingCustomRequests = await CustomCakeRequest.countDocuments({ status: 'pending' });
    const totalUsers = await User.countDocuments();

    // Calculate total revenue from delivered orders
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Recent orders count (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: lastWeek }
    });

    // Popular categories
    const popularCategories = await Cake.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      totalCakes,
      totalOrders,
      totalCustomRequests,
      pendingOrders,
      pendingCustomRequests,
      totalRevenue,
      totalUsers,
      recentOrders,
      popularCategories
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get all orders with pagination and filtering
router.get('/orders', async (req, res) => {
  try {
    console.log('📦 Fetching orders for admin:', req.user.id);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search;

    let filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { deliveryLocation: { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(filter)
      .populate('items.cake')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get single order details
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.cake');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update order status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.cake');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all custom cake requests with pagination
router.get('/custom-requests', async (req, res) => {
  try {
    console.log('🎨 Fetching custom requests for admin:', req.user.id);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search;

    let filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { occasion: { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await CustomCakeRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CustomCakeRequest.countDocuments(filter);

    res.json({
      success: true,
      requests,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRequests: total
    });
  } catch (error) {
    console.error('❌ Error fetching custom requests:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single custom request details
router.get('/custom-requests/:id', async (req, res) => {
  try {
    const request = await CustomCakeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    console.error('❌ Error fetching custom request:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update custom request status
router.patch('/custom-requests/:id/status', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const validStatuses = ['pending', 'quoted', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    const request = await CustomCakeRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    console.error('❌ Error updating custom request:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Cake management - Get all cakes
router.get('/cakes', async (req, res) => {
  try {
    console.log('🎂 Fetching cakes for admin:', req.user.id);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const featured = req.query.featured;
    const available = req.query.available;
    const search = req.query.search;

    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    if (available !== undefined) {
      filter.available = available === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { flavor: { $regex: search, $options: 'i' } }
      ];
    }

    const cakes = await Cake.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Cake.countDocuments(filter);

    res.json({
      success: true,
      cakes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCakes: total
    });
  } catch (error) {
    console.error('❌ Error fetching cakes:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create new cake with image upload
router.post('/cakes', upload.array('images', 5), async (req, res) => {
  try {
    console.log('📥 Creating new cake for admin:', req.user.id);
    console.log('Body:', req.body);
    console.log('Files count:', req.files ? req.files.length : 0);

    // Extract and validate required fields
    const { name, description, price, category, flavor } = req.body;
    
    if (!name || !description || !price || !category || !flavor) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided: name, description, price, category, flavor'
      });
    }

    // Prepare cake data
    const cakeData = {
      name: name,
      description: description,
      price: parseFloat(price),
      category: category,
      flavor: flavor,
      size: req.body.size || 'medium',
      featured: req.body.featured === 'true',
      available: req.body.available !== 'false',
      stockQuantity: parseInt(req.body.stockQuantity) || 0,
      lowStockThreshold: parseInt(req.body.lowStockThreshold) || 5,
      preparationTime: parseInt(req.body.preparationTime) || 24
    };

    // Handle image uploads to Cloudinary
    if (req.files && req.files.length > 0) {
      console.log('🖼️ Uploading images to Cloudinary...');
      const imageUrls = [];
      
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.buffer);
          imageUrls.push(result.secure_url);
          console.log('✅ Image uploaded to Cloudinary:', result.secure_url);
        } catch (uploadError) {
          console.error('❌ Cloudinary upload failed:', uploadError);
          // Use placeholder if Cloudinary fails
          const placeholderUrl = `https://via.placeholder.com/500x500/8B5CF6/FFFFFF?text=${encodeURIComponent(name)}`;
          imageUrls.push(placeholderUrl);
        }
      }
      
      cakeData.images = imageUrls;
    } else {
      cakeData.images = [];
    }

    console.log('🎂 Creating cake with data:', cakeData);

    const cake = new Cake(cakeData);
    const savedCake = await cake.save();

    console.log('✅ Cake created successfully:', savedCake._id);

    res.status(201).json({
      success: true,
      cake: savedCake
    });
  } catch (error) {
    console.error('❌ Error creating cake:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update cake
router.put('/cakes/:id', async (req, res) => {
  try {
    const cake = await Cake.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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
    console.error('❌ Error updating cake:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete cake
router.delete('/cakes/:id', async (req, res) => {
  try {
    const cake = await Cake.findByIdAndDelete(req.params.id);

    if (!cake) {
      return res.status(404).json({
        success: false,
        message: 'Cake not found'
      });
    }

    res.json({
      success: true,
      message: 'Cake deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting cake:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get current admin profile
router.get('/profile', async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
