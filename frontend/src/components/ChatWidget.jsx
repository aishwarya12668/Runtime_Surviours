import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { FAQ_STARTERS, getBreastCancerReply } from "../utils/breastCancerAnswers";

const STORAGE_KEY = "localFaqMessages";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [language] = useState("en");
  const [modeNote, setModeNote] = useState("");
  const listRef = useRef(null);

  const load = async () => {
    try {
      const { data } = await api.get("/chat/messages");
      setMessages(data);
      setModeNote("");
    } catch {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setMessages(saved);
      setModeNote("Using on-device answers for breast cancer topics.");
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setModeNote("");

    const userMsg = {
      _id: `u-${Date.now()}`,
      role: "user",
      message: text,
      timestamp: new Date().toISOString(),
    };

    try {
      await api.post("/chat/message", { message: text, language, fileUrl: "" });
      await load();
    } catch {
      const reply = getBreastCancerReply(text);
      const assistantMsg = {
        _id: `a-${Date.now() + 1}`,
        role: "assistant",
        message: reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => {
        const next = [...prev, userMsg, assistantMsg];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      setModeNote("Using on-device answers for breast cancer topics.");
    }
  };

  return (
    <>
      <button
        type="button"
        className="chat-widget-fab"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <span className="chat-widget-fab-icon" aria-hidden>
          ◎
        </span>
      </button>

      {open && (
        <div className="chat-widget-panel" role="dialog" aria-label="Nivara assistant">
          <div className="chat-widget-header">
            <div>
              <strong>Nivara Assistant</strong>
              <div className="chat-widget-sub">Breast cancer information &amp; support</div>
            </div>
            <button type="button" className="chat-widget-close" onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </div>

          {modeNote && <p className="chat-widget-note">{modeNote}</p>}

          <div className="chat-widget-starters">
            {FAQ_STARTERS.map((q) => (
              <button key={q} type="button" className="chat-widget-chip" onClick={() => setInput(q)}>
                {q.length > 42 ? `${q.slice(0, 40)}…` : q}
              </button>
            ))}
          </div>

          <div className="chat-widget-messages" ref={listRef}>
            {messages.length === 0 && (
              <p className="muted chat-widget-empty">Ask anything about breast cancer—symptoms, screening, treatment, side effects, or emotional support.</p>
            )}
            {messages.map((m) => (
              <div key={m._id} className={`chat-widget-bubble ${m.role}`}>
                <div>{m.message}</div>
                <small>{new Date(m.timestamp).toLocaleTimeString()}</small>
              </div>
            ))}
          </div>

          <div className="chat-widget-footer">
            <input
              className="chat-widget-input"
              placeholder="Type your question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button type="button" className="btn chat-widget-send" onClick={send}>
              Send
            </button>
          </div>
          <p className="chat-widget-disclaimer">General information only—not a substitute for your doctor.</p>
        </div>
      )}
    </>
  );
}
