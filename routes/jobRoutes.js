const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Post a job
router.post("/", async (req, res) => {
  try {
    const { title, description, location, payment, availability, postedBy } = req.body;
    const job = new Job({ title, description, location, payment, availability, postedBy, appliedBy: [] });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Hustler applies to a job
router.post("/apply/:id", async (req, res) => {
  try {
    const { username } = req.body; // hustler name
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (!job.appliedBy.includes(username)) {
      job.appliedBy.push(username);
      await job.save();
    }

    res.json({ message: "Applied successfully", job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
