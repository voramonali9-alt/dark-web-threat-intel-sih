const express = require('express');
const { addProduct, buyProduct, getShopProducts } = require('../controllers/productController');
const router = express.Router();

// Route 1: Dukaan mein naya item add karna
router.post('/add', addProduct);

// Route 2: Item kharidna aur stock minus karna
router.post('/buy', buyProduct);

// Route 3: Dukaan ka saara samaan dekhna
router.get('/shop/:shopId', getShopProducts);

module.exports = router;
