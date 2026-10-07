const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["student", "company", "admin"],
      required: true
    },
    phone: { type: String, default: "" },

    branch: { type: String, default: "" },
    year: { type: Number, default: null },
    cgpa: { type: Number, default: null },
    backlogs: { type: Number, default: 0 },

    companyName: { type: String, default: "" },
    website: { type: String, default: "" },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
