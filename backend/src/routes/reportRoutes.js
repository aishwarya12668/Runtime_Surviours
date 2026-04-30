const express = require("express");
const Report = require("../models/Report");
const { protect } = require("../middleware/auth");
const upload = require("../utils/upload");

const router = express.Router();

router.post("/reports/upload", protect, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "File is required" });
  const fileUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  const report = await Report.create({
    patientId: req.user.userId,
    fileUrl,
    originalName: req.file.originalname,
  });
  res.status(201).json(report);
});

router.get("/reports", protect, async (req, res) => {
  const reports = await Report.find({ patientId: req.user.userId }).sort({ createdAt: -1 });
  res.json(reports);
});

module.exports = router;
