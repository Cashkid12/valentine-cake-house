import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  deliveryLocation: {
    type: String,
    required: true
  },
  items: [{
    cake: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cake'
    },
    quantity: {
      type: Number,
      default: 1
    },
    customizations: {
      type: Map,
      of: String
    },
    price: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  customerNotes: String,
  specialInstructions: String,
  // New customer relationship fields
  customerType: {
    type: String,
    enum: ['new', 'returning', 'regular'],
    default: 'new'
  },
  preferredContact: {
    type: String,
    enum: ['phone', 'email', 'whatsapp'],
    default: 'phone'
  }
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);