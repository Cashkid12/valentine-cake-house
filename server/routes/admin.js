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

// Cloudinary upload function using the configured cloudinary instance
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
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get all orders with pagination and filtering
router.get('/orders', async (req, res) => {
  try {
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete order
router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all custom cake requests with pagination
router.get('/custom-requests', async (req, res) => {
  try {
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add notes to custom request
router.patch('/custom-requests/:id/notes', async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const request = await CustomCakeRequest.findByIdAndUpdate(
      req.params.id,
      { adminNotes },
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete custom request
router.delete('/custom-requests/:id', async (req, res) => {
  try {
    const request = await CustomCakeRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      message: 'Custom request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Cake management - Get all cakes
router.get('/cakes', async (req, res) => {
  try {
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single cake details
router.get('/cakes/:id', async (req, res) => {
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

// Create new cake with image upload
router.post('/cakes', upload.array('images', 5), async (req, res) => {
  try {
    console.log('📥 SERVER: Received FormData for cake creation');
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
      available: req.body.available !== 'false', // Default to true
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
          console.log('🔄 Using placeholder image instead');
        }
      }
      
      cakeData.images = imageUrls;
    } else {
      cakeData.images = []; // Set empty array if no images
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
    console.error('❌ SERVER: Error creating cake:', error);
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Toggle cake featured status
router.patch('/cakes/:id/feature', async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);

    if (!cake) {
      return res.status(404).json({
        success: false,
        message: 'Cake not found'
      });
    }

    cake.featured = !cake.featured;
    await cake.save();

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

// Toggle cake availability
router.patch('/cakes/:id/availability', async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);

    if (!cake) {
      return res.status(404).json({
        success: false,
        message: 'Cake not found'
      });
    }

    cake.available = !cake.available;
    await cake.save();

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

// User management routes (admin only)
router.get('/users', authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create new user (admin only)
router.post('/users', authorize('admin'), async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update user (admin only)
router.patch('/users/:id', authorize('admin'), async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete user (admin only)
router.delete('/users/:id', authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Toggle user active status (admin only)
router.patch('/users/:id/status', authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update admin profile
router.patch('/profile', async (req, res) => {
  try {
    const { username, email } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;