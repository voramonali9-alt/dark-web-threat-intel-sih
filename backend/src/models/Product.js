const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  shop: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Shop', 
    required: true // Ye item kis dukaan ka hai
  },
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  stockQuantity: { 
    type: Number, 
    required: true, 
    default: 0 // Kitna item available hai customer ke liye
  },
  expiredQuantity: {
    type: Number,
    default: 0 // Smart Feature: Expire hone par item yahan shift ho jayega automatically
  },
  alertLimit: { 
    type: Number, 
    default: 5 // Is limit par notification jayega
  },
  discount: { 
    type: String // e.g., "10% OFF" ya "Buy 1 Get 1"
  },
  imageUrl: { 
    type: String // Item ki photo ke liye
  },
  expiryDate: { 
    type: Date // The Smart Expiry Date feature
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
