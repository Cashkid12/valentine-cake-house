import dotenv from 'dotenv';
dotenv.config({ path: '.env' }); // Explicitly specify the path

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Routes imports
import cakeRoutes from './routes/cakes.js';
import orderRoutes from './routes/orders.js';
import customCakeRoutes from './routes/customCakes.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import inventoryRoutes from './routes/inventory.js';
import analyticsRoutes from './routes/analytics.js';
import customersRoutes from './routes/customers.js';
import bulkRoutes from './routes/bulk.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/cakes', cakeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-cakes', customCakeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/bulk', bulkRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Valentine Cake House API' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});