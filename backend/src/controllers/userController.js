const User = require('../models/User');

// 1. Register API
const registerUser = async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;

    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: "Ye phone number pehle se register hai!" });
    }

    const user = await User.create({ name, phone, password, role });

    res.status(201).json({
      message: "User successfully register ho gaya!",
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Server mein kuch gadbad hai." });
  }
};

// 2. Login API (Naya Code)
const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Step A: Check karein ki kya is phone number ka koi user hai?
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "Ye phone number hamare paas register nahi hai. Pehle register karein." });
    }

    // Step B: Agar user mil gaya, toh password check karein
    if (user.password !== password) {
      return res.status(401).json({ message: "Aapka password galat hai. Wapas try karein." });
    }

    // Step C: Agar dono sahi hain, toh login success
    res.status(200).json({
      message: "Aap successfully login ho gaye hain! 🎉",
      user: { id: user._id, name: user.name, role: user.role }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server mein kuch gadbad hai." });
  }
};

module.exports = { registerUser, loginUser };
