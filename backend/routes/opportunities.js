const express = require("express");
const Opportunity = require("../models/Opportunity");
const Application = require("../models/Application");
const User = require("../models/User");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

function eligibleFor(student, opportunity) {
  const e = opportunity.eligibility || {};
  const branchOK =
    !e.branches?.length ||
    e.branches.map(String).map(x => x.toLowerCase()).includes(String(student.branch).toLowerCase());

  return (
    Number(student.cgpa || 0) >= Number(e.minCGPA || 0) &&
    Number(student.backlogs || 0) <= Number(e.maxBacklogs ?? 0) &&
    Number(student.year || 0) >= Number(e.minYear || 1) &&
    branchOK
  );
}

router.get("/", authenticate, async (req, res) => {
  const opportunities = await Opportunity.find()
    .populate("company", "name companyName website")
    .sort({ createdAt: -1 });

  if (req.user.role === "student") {
    return res.json(
      opportunities.map(o => ({
        ...o.toObject(),
        eligible: eligibleFor(req.user, o)
      }))
    );
  }

  res.json(opportunities);
});

router.post("/", authenticate, authorize("company"), async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      package: salaryPackage,
      jobType,
      deadline,
      minCGPA,
      maxBacklogs,
      branches,
      minYear
    } = req.body;

    const opportunity = await Opportunity.create({
      company: req.user.id,
      title,
      description,
      location,
      package: salaryPackage,
      jobType,
      deadline,
      eligibility: {
        minCGPA: Number(minCGPA) || 0,
        maxBacklogs: Number(maxBacklogs) || 0,
        branches: Array.isArray(branches)
          ? branches
          : String(branches || "")
              .split(",")
              .map(x => x.trim())
              .filter(Boolean),
        minYear: Number(minYear) || 1
      }
    });

    const populated = await opportunity.populate("company", "name companyName");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: "Could not create opportunity", error: error.message });
  }
});

router.get("/mine", authenticate, authorize("company"), async (req, res) => {
  const opportunities = await Opportunity.find({ company: req.user.id })
    .sort({ createdAt: -1 });
  res.json(opportunities);
});

router.delete("/:id", authenticate, authorize("company"), async (req, res) => {
  const opportunity = await Opportunity.findOne({
    _id: req.params.id,
    company: req.user.id
  });

  if (!opportunity) return res.status(404).json({ message: "Opportunity not found" });

  await Application.deleteMany({ opportunity: opportunity._id });
  await opportunity.deleteOne();

  res.json({ message: "Opportunity deleted" });
});

module.exports = router;
