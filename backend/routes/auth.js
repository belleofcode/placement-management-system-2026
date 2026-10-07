const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

function tokenFor(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function safeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    branch: user.branch,
    year: user.year,
    cgpa: user.cgpa,
    backlogs: user.backlogs,
    companyName: user.companyName,
    website: user.website,
    description: user.description
  };
}

router.post("/register", async (req, res) => {
  try {
    const {
      role,
      name,
      email,
      password,
      phone,
      branch,
      year,
      cgpa,
      backlogs,
      companyName,
      website,
      description
    } = req.body;

    if (!["student", "company"].includes(role)) {
      return res.status(400).json({ message: "Only student and company registration is allowed." });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      role,
      name,
      email: email.toLowerCase(),
      password: hashed,
      phone: phone || "",
      branch: role === "student" ? branch || "" : "",
      year: role === "student" ? Number(year) || null : null,
      cgpa: role === "student" ? Number(cgpa) || null : null,
      backlogs: role === "student" ? Number(backlogs) || 0 : 0,
      companyName: role === "company" ? companyName || name : "",
      website: role === "company" ? website || "" : "",
      description: role === "company" ? description || "" : ""
    });

    res.status(201).json({
      message: "Account created successfully",
      token: tokenFor(user),
      user: safeUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({
      email: email?.toLowerCase(),
      role
    }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email, password or profile." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email, password or profile." });
    }

    res.json({
      message: "Login successful",
      token: tokenFor(user),
      user: safeUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

module.exports = router;
