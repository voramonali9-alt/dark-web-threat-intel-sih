require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/shopRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Frontend ko backend se baat karne ki permission dena (CORS)
app.use(cors());

// 1. Database Connect karo
connectDB();

// 2. Data ko JSON format mein receive karne ke liye permission
app.use(express.json());

// 3. APIs ka Rasta (Routes)
// Har URL jo '/api/users' se shuru hoga, wo userRoutes file handle karegi
app.use('/api/users', userRoutes);
// Har URL jo '/api/shops' se shuru hoga, wo shopRoutes handle karegi
app.use('/api/shops', shopRoutes);
// Har URL jo '/api/products' se shuru hoga, wo productRoutes handle karegi
app.use('/api/products', productRoutes);

// Basic test URL
app.get('/', (req, res) => {
    res.send('Smart Shop Backend is Running! 🚀');
});

// Server start karne ka code
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
