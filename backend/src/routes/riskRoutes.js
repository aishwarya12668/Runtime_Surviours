const express = require("express");
const Patient = require("../models/Patient");
const { protect } = require("../middleware/auth");

const router = express.Router();

const guidanceByRisk = {
  Low: "Continue healthy lifestyle, annual screening, and symptom monitoring.",
  Medium: "Schedule specialist consultation and maintain monthly self-check reminders.",
  High: "Urgent specialist follow-up, diagnostic imaging, and strict treatment adherence.",
};

router.post("/risk", protect, async (req, res) => {
  try {
    const { age, medicalHistory = "", familyHistory = false, symptoms = false } = req.body;
    let score = 0;
    if (age >= 45) score += 2;
    if (familyHistory) score += 2;
    if (symptoms) score += 2;
    if (medicalHistory.length > 10) score += 1;

    const riskLevel = score >= 5 ? "High" : score >= 3 ? "Medium" : "Low";
    const patient = await Patient.findOneAndUpdate(
      { userId: req.user.userId },
      { age, medicalHistory, riskLevel },
      { new: true, upsert: true }
    );

    return res.json({
      riskLevel,
      guidance: guidanceByRisk[riskLevel],
      patient,
    });
  } catch (error) {
    return res.status(500).json({ message: "Risk screening failed", error: error.message });
  }
});

module.exports = router;
