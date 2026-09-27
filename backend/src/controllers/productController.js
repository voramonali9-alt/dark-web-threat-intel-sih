const Product = require('../models/Product');

// 1. Dukaan mein naya samaan add karne ka logic
const addProduct = async (req, res) => {
  try {
    const { shopId, name, price, stockQuantity, alertLimit, expiryDate } = req.body;

    // Database mein item save karna
    const newProduct = await Product.create({
      shop: shopId,
      name,
      price,
      stockQuantity,
      alertLimit, // Jaise hi stock is number par aayega, alarm bajega
      expiryDate
    });

    res.status(201).json({
      message: "Samaan dukaan mein successfully add ho gaya! 📦",
      product: newProduct
    });
  } catch (error) {
    console.error("Product Add Error:", error);
    res.status(500).json({ message: "Server error: Samaan add nahi ho paya." });
  }
};

// 2. SMART FEATURE: Samaan kharidna aur automatic stock minus karna
const buyProduct = async (req, res) => {
  try {
    const { productId, quantityBought } = req.body;

    // 1. Pehle database mein item dhundho
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Item database mein nahi mila." });
    }

    // 2. Check karo ki dukaan mein utna stock bacha bhi hai ya nahi?
    if (product.stockQuantity < quantityBought) {
      return res.status(400).json({ 
        message: `Sorry, dukaan mein sirf ${product.stockQuantity} items hi bache hain.` 
      });
    }

    // 3. Stock ko automatic MINUS karo (Aapka Smart Idea)
    product.stockQuantity = product.stockQuantity - quantityBought;
    await product.save(); // Update hua data save kar do

    // 4. NEW LOGIC: Kamai (Sales) ko Dukaan mein add karo
    const shop = await Shop.findById(product.shop);
    if (shop) {
      shop.totalSales = (shop.totalSales || 0) + (product.price * quantityBought);
      await shop.save();
    }

    // 5. ALARM CHECK: Agar stock danger level se niche chala gaya
    let warningMessage = "";
    if (product.stockQuantity <= product.alertLimit) {
      warningMessage = `⚠️ ALARM: Aapka '${product.name}' ka stock bahut kam bacha hai (${product.stockQuantity} bache hain). Kripya naya stock order karein!`;
    }

    // 6. Customer ko success message bhejo
    res.status(200).json({
      message: "Purchase successful! Item ka stock automatic kam ho gaya hai. 🛒",
      remainingStock: product.stockQuantity,
      alert: warningMessage // Agar stock kam hoga toh ye message screen par jayega
    });

  } catch (error) {
    console.error("Buy Error:", error);
    res.status(500).json({ message: "Purchase complete karne mein error aaya." });
  }
};

// 3. Kisi ek dukaan ka saara samaan dekhna (Customer ke liye API)
const getShopProducts = async (req, res) => {
  try {
    // URL mein se shopId nikal kar database mein us dukaan ka samaan dhundho
    const products = await Product.find({ shop: req.params.shopId });
    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Samaan load nahi ho paya." });
  }
};

module.exports = { addProduct, buyProduct, getShopProducts };
