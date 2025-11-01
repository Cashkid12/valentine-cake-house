import mongoose from 'mongoose';

const customCakeRequestSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  occasion: {
    type: String,
    required: true,
    trim: true
  },
  cakeSize: {
    type: String,
    required: true,
    trim: true
  },
  flavor: {
    type: String,
    required: true,
    trim: true
  },
  icing: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  designDescription: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  budget: {
    type: Number,
    min: 0
  },
  deliveryDate: {
    type: Date
  },
  deliveryLocation: {
    type: String,
    trim: true
  },
  specialInstructions: {
    type: String,
    trim: true
  },
  referenceImages: [{
    type: String // Cloudinary URLs
  }],
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected', 'in-progress', 'completed'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  quoteAmount: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

// Create index for better query performance
customCakeRequestSchema.index({ status: 1, createdAt: -1 });
customCakeRequestSchema.index({ phone: 1 });

const CustomCakeRequest = mongoose.model('CustomCakeRequest', customCakeRequestSchema);

export default CustomCakeRequest;