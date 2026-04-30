const express = require("express");
const OpenAI = require("openai");
const { protect } = require("../middleware/auth");
const ChatMessage = require("../models/ChatMessage");
const upload = require("../utils/upload");

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/chat/upload", protect, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "File required" });
  const fileUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  res.status(201).json({ fileUrl, originalName: req.file.originalname });
});

router.post("/chat/message", protect, async (req, res) => {
  try {
    const { message, language = "en", fileUrl } = req.body;
    await ChatMessage.create({ userId: req.user.userId, message, role: "user", language, fileUrl });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are NivaraCare AI. Provide safe breast cancer care guidance, emotional support, FAQs, treatment adherence help, and suggest contacting a doctor for emergencies. Keep responses concise and compassionate.",
        },
        { role: "user", content: `Language:${language}. User: ${message}` },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || "I am here to support you.";
    const assistantMsg = await ChatMessage.create({
      userId: req.user.userId,
      message: reply,
      role: "assistant",
      language,
    });

    return res.json(assistantMsg);
  } catch (error) {
    return res.status(500).json({ message: "Chat failed", error: error.message });
  }
});

router.get("/chat/messages", protect, async (req, res) => {
  const messages = await ChatMessage.find({ userId: req.user.userId }).sort({ timestamp: 1 });
  res.json(messages);
});

module.exports = router;
