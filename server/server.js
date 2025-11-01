import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Routes imports
import cakeRoutes from './routes/cakes.js';
import orderRoutes from './routes/orders.js';
import customCakeRoutes from './routes/customCakes.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';

const app = express();

// CORS configuration for production
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app' // We'll update this after frontend deployment
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/cakes', cakeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-cakes', customCakeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Valentine Cake House API',
    status: 'Running 🚀'
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
