const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true // Har dukaan ka ek malik (User) hoga
  },
  shopName: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true // e.g., Grocery, Bakery, Clothes, Govt Yojna
  },
  address: { 
    type: String, 
    required: true 
  },
  contactNumber: { 
    type: String, 
    required: true 
  },
  isOpen: { 
    type: Boolean, 
    default: true // Dukaan open hai ya close, shopkeeper app se button daba kar change kar sakta hai
  }
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);
