const Shop = require('../models/Shop');

// 1. Nayi Dukaan Banane ki API (Shopkeeper ke liye)
const createShop = async (req, res) => {
  try {
    const { ownerId, shopName, category, address, contactNumber } = req.body;

    // Database mein dukaan ki entry karna
    const newShop = await Shop.create({
      owner: ownerId, // Ye us shopkeeper ki ID hogi jo register kar raha hai
      shopName: shopName,
      category: category,
      address: address,
      contactNumber: contactNumber
    });

    res.status(201).json({
      message: "Aapki Dukaan successfully register ho gayi hai! 🏪",
      shop: newShop
    });
  } catch (error) {
    console.error("Shop Creation Error:", error);
    res.status(500).json({ message: "Server error: Dukaan save nahi ho paayi." });
  }
};

// 2. Nayi API: Malik (Owner) ke hisaab se dukaan dhundhna
const getShopByOwner = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.params.ownerId });
    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ message: "Dukaan load karne mein error aaya." });
  }
};

// 3. Saari Dukaanein dekhne ki API (Customers ke liye)
const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find(); // Database se saari dukanein utha layega
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ message: "Dukaanein load karne mein error aaya." });
  }
};

module.exports = { createShop, getShopByOwner, getAllShops };
