const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Ab hum Local ki jagah Cloud (MongoDB Atlas) URL use karenge jo .env file se aayega
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Cloud MongoDB Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1); 
  }
};

module.exports = connectDB;
