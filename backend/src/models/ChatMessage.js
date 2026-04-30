const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  role: { type: String, enum: ["user", "assistant"], required: true },
  language: { type: String, default: "en" },
  fileUrl: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
