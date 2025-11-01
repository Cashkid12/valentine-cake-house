import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes imports
import cakeRoutes from './routes/cakes.js';
import orderRoutes from './routes/orders.js';
import customCakeRoutes from './routes/customCakes.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';

const app = express();

// CORS configuration - Allow all origins in production
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000', 
      'https://valentine-cake-house.vercel.app',
      'https://valentine-cake-house-git-main-cashkid12s-projects.vercel.app',
      /\.vercel\.app$/, // Allow all Vercel deployments
      /\.render\.com$/, // Allow all Render deployments
      /\.netlify\.app$/ // All Netlify deployments
    ];
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') return origin === pattern;
      if (pattern instanceof RegExp) return pattern.test(origin);
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      callback(null, true); // Allow all in production for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/cakes', cakeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-cakes', customCakeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Root API route
app.get('/api', (req, res) => {
  res.json({ 
    message: '🎂 Valentine Cake House API',
    version: '1.0.0',
    status: 'Running 🚀',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      cakes: '/api/cakes',
      orders: '/api/orders', 
      customCakes: '/api/custom-cakes',
      admin: '/api/admin',
      auth: '/api/auth',
      health: '/api/health'
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// MongoDB connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    
    // Auto-create admin user if doesn't exist
    try {
      const User = (await import('./models/User.js')).default;
      const existingAdmin = await User.findOne({ email: 'admin@valentinecakehouse.com' });
      
      if (!existingAdmin) {
        await User.create({
          username: 'admin',
          email: 'admin@valentinecakehouse.com',
          password: 'valentine2024',
          role: 'admin'
        });
        console.log('✅ Admin user created automatically');
      } else {
        console.log('✅ Admin user exists:', existingAdmin.email);
      }
    } catch (userError) {
      console.log('⚠️ Could not create admin user:', userError.message);
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// Handle undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found' 
  });
});

// Root route
app.get('/', (req, res) => {
  res.redirect('/api');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
});
