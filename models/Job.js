const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  payment: { type: Number, required: true },
  availability: String,
  postedBy: String,       // client name
  appliedBy: [String],    // list of hustlers who applied
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
