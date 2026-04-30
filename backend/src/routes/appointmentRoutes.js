const express = require("express");
const dayjs = require("dayjs");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Reminder = require("../models/Reminder");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/doctors", protect, async (_req, res) => {
  const doctors = await Doctor.find().sort({ name: 1 });
  res.json(doctors);
});

router.post("/appointments", protect, async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    const normalizedDate = new Date(date);

    const exists = await Appointment.findOne({ doctorId, date: normalizedDate });
    if (exists) {
      return res.status(400).json({ message: "Slot unavailable for selected doctor and time." });
    }

    const appointment = await Appointment.create({
      patientId: req.user.userId,
      doctorId,
      date: normalizedDate,
      status: "scheduled",
    });

    await Reminder.create({
      patientId: req.user.userId,
      type: "Appointment Reminder",
      date: dayjs(normalizedDate).subtract(1, "day").toDate(),
    });

    return res.status(201).json(appointment);
  } catch (error) {
    return res.status(500).json({ message: "Booking failed", error: error.message });
  }
});

router.get("/appointments", protect, async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.user.userId })
    .populate("doctorId", "name specialization")
    .sort({ date: 1 });
  res.json(appointments);
});

module.exports = router;
