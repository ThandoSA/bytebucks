const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// Create a new job
router.post("/", async (req, res) => {
  try {
    const { title, description, location, payment, availability } = req.body;
    const job = new Job({ title, description, location, payment, availability });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
