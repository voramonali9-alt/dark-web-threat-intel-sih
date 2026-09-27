const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true, 
    unique: true // Ek number se ek hi account banega
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['Customer', 'Shopkeeper'], // Role fix kar diya hai
    default: 'Customer' 
  }
}, { timestamps: true }); // kab account bana, uska time save karega

module.exports = mongoose.model('User', userSchema);
