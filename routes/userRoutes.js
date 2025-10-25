// Import dependencies
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import the User model

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Save user to database
    const user = new User({ name, email });
    await user.save();

    res.status(201).json({
      message: "✅ User created successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/users
 * @desc    Fetch all users
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/users/test
 * @desc    Test route to verify user routes work
 * @access  Public
 */
router.get("/test", (req, res) => {
  res.send("✅ User route working!");
});

module.exports = router;
