const express = require("express");
const dayjs = require("dayjs");
const Appointment = require("../models/Appointment");
const Report = require("../models/Report");
const Reminder = require("../models/Reminder");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", protect, async (req, res) => {
  const patientId = req.user.userId;
  const [appointments, reports, reminders] = await Promise.all([
    Appointment.find({ patientId }).sort({ date: 1 }),
    Report.find({ patientId }).sort({ createdAt: -1 }),
    Reminder.find({ patientId }).sort({ date: 1 }),
  ]);

  const missed = appointments.filter((a) => a.status === "missed").length;
  const engagementPenalty = reports.length < 1 ? 20 : 0;
  const continuityScore = Math.max(0, 100 - missed * 20 - engagementPenalty);

  const alerts = [];
  if (missed > 0) alerts.push("You have missed follow-ups. Please reschedule.");
  if (continuityScore < 60) alerts.push("Dropout risk detected: low engagement in care plan.");

  res.json({
    overview: {
      appointments: appointments.length,
      reports: reports.length,
      reminders: reminders.length,
    },
    treatmentTimeline: appointments.map((a) => ({
      date: a.date,
      status: a.status,
    })),
    careContinuityScore: continuityScore,
    alerts,
    upcomingReminders: reminders.filter((r) => dayjs(r.date).isAfter(dayjs())).slice(0, 5),
  });
});

router.post("/reminders", protect, async (req, res) => {
  const reminder = await Reminder.create({ patientId: req.user.userId, ...req.body });
  res.status(201).json(reminder);
});

module.exports = router;
