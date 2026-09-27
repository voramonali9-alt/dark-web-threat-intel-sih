const express = require('express');
const { createShop, getShopByOwner, getAllShops } = require('../controllers/shopController');
const router = express.Router();

// Route 1: Shopkeeper jab dukaan banayega
router.post('/create', createShop);

// Route 2: Malik ki dukaan lana
router.get('/owner/:ownerId', getShopByOwner);

// Route 3: Customer jab saari dukanein dekhega
router.get('/all', getAllShops);

module.exports = router;
