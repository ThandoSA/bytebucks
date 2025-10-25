const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Test route
router.get("/", (req, res) => {
  res.send("User API is working!");
});

// Add new user (signup)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;
    const newUser = new User({ name, email, password, userType });
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

module.exports = router;
