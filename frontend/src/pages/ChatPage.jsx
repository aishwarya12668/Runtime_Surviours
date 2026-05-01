import { useEffect, useState } from "react";
import api from "../services/api";
import { FAQ_STARTERS, getBreastCancerReply } from "../utils/breastCancerAnswers";

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
          message: getBreastCancerReply(message),
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
          {FAQ_STARTERS.map((item) => (
            <button key={item} className="option-card" type="button" onClick={() => setMessage(item)}>
              {item}
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
