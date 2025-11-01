import mongoose from 'mongoose';

const cakeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    enum: ['birthday', 'wedding', 'kids', 'custom', 'anniversary', 'graduation'],
    required: true
  },
  flavor: {
    type: String,
    enum: ['vanilla', 'chocolate', 'red-velvet', 'strawberry', 'lemon', 'carrot'],
    required: true
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'custom'],
    default: 'medium'
  },
  featured: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  },
  // New inventory fields
  stockQuantity: {
    type: Number,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  },
  ingredients: [{
    name: String,
    quantity: String,
    unit: String
  }],
  allergens: [String],
  preparationTime: {
    type: Number, // in hours
    default: 24
  },
  customizations: {
    type: [String],
    default: []
  },
  tags: [String]
}, {
  timestamps: true
});

// Virtual for stock status
cakeSchema.virtual('stockStatus').get(function() {
  if (this.stockQuantity === 0) return 'out-of-stock';
  if (this.stockQuantity <= this.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

cakeSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Cake', cakeSchema);