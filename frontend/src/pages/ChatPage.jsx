import { useEffect, useState } from "react";
import api from "../services/api";

const FAQ_RESPONSES = [
  {
    q: "What are common symptoms of breast cancer?",
    a: "Common signs include a new lump in breast or armpit, change in breast shape/size, nipple discharge, skin dimpling, or persistent pain. Any new change should be checked by a doctor.",
  },
  {
    q: "How often should I do breast self-exam?",
    a: "A monthly self-check is helpful. Also schedule regular clinical exams and age-appropriate mammograms based on your doctor's advice.",
  },
  {
    q: "Can breast cancer be treated successfully?",
    a: "Yes. Early detection and timely treatment improve outcomes significantly. Treatment may include surgery, chemotherapy, radiation, hormone therapy, or targeted therapy.",
  },
  {
    q: "When should I see a doctor urgently?",
    a: "See a doctor promptly if you notice a persistent lump, bloody nipple discharge, skin changes, swelling, or rapidly worsening symptoms.",
  },
];

const getFaqReply = (text) => {
  const q = text.toLowerCase();
  if (q.includes("symptom")) return FAQ_RESPONSES[0].a;
  if (q.includes("self") || q.includes("exam")) return FAQ_RESPONSES[1].a;
  if (q.includes("treat") || q.includes("cure")) return FAQ_RESPONSES[2].a;
  if (q.includes("urgent") || q.includes("doctor") || q.includes("lump")) return FAQ_RESPONSES[3].a;
  return "I can help with basic breast cancer FAQs on symptoms, screening, treatment, and when to see a doctor. Ask me a specific question.";
};

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en");
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setMessages((await api.get("/chat/messages")).data);
    } catch (_error) {
      const saved = JSON.parse(localStorage.getItem("localFaqMessages") || "[]");
      setMessages(saved);
    }
  };

  useEffect(() => { load(); }, []);

  const saveLocalMessages = (next) => {
    localStorage.setItem("localFaqMessages", JSON.stringify(next));
    setMessages(next);
  };

  const send = async () => {
    if (!message.trim()) return;
    setError("");
    try {
      await api.post("/chat/message", { message, language, fileUrl });
      setMessage("");
      setFileUrl("");
      load();
    } catch (_error) {
      const next = [
        ...messages,
        {
          _id: `local-user-${Date.now()}`,
          role: "user",
          message: message.trim(),
          timestamp: new Date().toISOString(),
        },
        {
          _id: `local-ai-${Date.now() + 1}`,
          role: "assistant",
          message: getFaqReply(message),
          timestamp: new Date().toISOString(),
        },
      ];
      saveLocalMessages(next);
      setMessage("");
      setFileUrl("");
      setError("Running in FAQ mode (chat service unavailable).");
    }
  };
  const upload = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const fd = new FormData(); fd.append("file", f);
    const { data } = await api.post("/chat/upload", fd); setFileUrl(data.fileUrl);
  };
  return (
    <div className="page">
      <div className="container panel list-stack">
        <h2>AI Chat Assistant</h2>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option><option value="hi">Hindi</option><option value="ta">Tamil</option>
        </select>
        <div className="stats-grid">
          {FAQ_RESPONSES.map((item) => (
            <button key={item.q} className="option-card" type="button" onClick={() => setMessage(item.q)}>
              {item.q}
            </button>
          ))}
        </div>
        <div className="chat-box">
          {messages.map((m) => <div key={m._id} className={`bubble ${m.role}`}>{m.message}<div><small>{new Date(m.timestamp).toLocaleTimeString()}</small></div></div>)}
        </div>
        <input placeholder="Type message..." value={message} onChange={(e) => setMessage(e.target.value)} />
        <input type="file" onChange={upload} />
        {fileUrl && <p>File attached: {fileUrl}</p>}
        {error && <p className="muted">{error}</p>}
        <button className="btn" onClick={send}>Send</button>
      </div>
    </div>
  );
}
