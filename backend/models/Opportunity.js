const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, default: "Not specified" },
    package: { type: String, default: "Not specified" },
    jobType: { type: String, default: "Full Time" },
    deadline: { type: Date, required: true },

    eligibility: {
      minCGPA: { type: Number, default: 0 },
      maxBacklogs: { type: Number, default: 0 },
      branches: { type: [String], default: [] },
      minYear: { type: Number, default: 1 }
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);
