const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Import job routes
const jobRoutes = require("./routes/jobRoutes");
app.use("/api/jobs", jobRoutes);

// Default route
app.get("/", (req, res) => {
res.send("Welcome to the Side Hustle Hub backend!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
