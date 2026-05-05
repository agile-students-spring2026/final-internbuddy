import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../utils/auth";

const POLL_MS = 3000;

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function DirectMessagePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const latestMessageIdRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Initial load
  useEffect(() => {
    fetch(`/api/messages/${id}`, { headers: authHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data && data.conversation) {
          setConversation(data.conversation);
          const msgs = data.messages || [];
          setMessages(msgs);
          if (msgs.length > 0) latestMessageIdRef.current = msgs[msgs.length - 1].id;
        }
      })
      .catch(err => console.error("Failed to fetch messages:", err));
  }, [id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/messages/${id}`, { headers: authHeaders() })
        .then(res => res.json())
        .then(data => {
          if (data && data.messages) {
            const incoming = data.messages;
            // Only update if there are new messages (avoids re-render flicker)
            const lastId = incoming.length > 0 ? incoming[incoming.length - 1].id : null;
            if (lastId !== latestMessageIdRef.current) {
              latestMessageIdRef.current = lastId;
              setMessages(incoming);
            }
          }
        })
        .catch(() => {});
    }, POLL_MS);
    return () => clearInterval(interval);
  }, [id]);

  const handleSend = (e) => {
    e.preventDefault();
    const text = newText.trim();
    if (!text || sending) return;

    setSending(true);
    setNewText("");

    fetch(`/api/messages/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ text }),
    })
      .then(res => res.json())
      .then(msg => {
        if (msg && msg.id) {
          setMessages(prev => [...prev, msg]);
          latestMessageIdRef.current = msg.id;
        }
      })
      .catch(err => console.error("Failed to send message:", err))
      .finally(() => {
        setSending(false);
        inputRef.current?.focus();
      });
  };

  // Allow sending with Enter key (Shift+Enter for newline is not applicable on single-line input)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (!conversation) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#eeeef8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "390px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100" style={{ flexShrink: 0 }}>
          <button onClick={() => navigate("/messages")} className="text-sm text-indigo-600">
            ← Back
          </button>
          <img
            src={conversation.otherUser.avatar}
            alt={conversation.otherUser.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">{conversation.otherUser.name}</p>
            <p className="text-xs text-gray-400">{conversation.otherUser.subtitle}</p>
          </div>
        </div>

        {/* Messages — flex-1 + overflow scroll */}
        <div
          style={{ flex: 1, overflowY: "auto", padding: "16px", background: "#fafafe" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{ display: "flex", justifyContent: msg.sender === "me" ? "flex-end" : "flex-start" }}
              >
                <div
                  style={{
                    padding: "8px 16px",
                    borderRadius: "18px",
                    fontSize: "14px",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                    background: msg.sender === "me" ? "#4f46e5" : "#fff",
                    color: msg.sender === "me" ? "#fff" : "#111",
                    border: msg.sender === "me" ? "none" : "1px solid #e5e7eb",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input — pinned to bottom, visible above keyboard */}
        <form
          onSubmit={handleSend}
          style={{
            flexShrink: 0,
            padding: "12px 16px",
            borderTop: "1px solid #f0f0f5",
            background: "#fff",
            paddingBottom: "max(12px, env(safe-area-inset-bottom))",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#f3f4f6",
              border: "1.5px solid #c7d2fe",
              borderRadius: "12px",
              padding: "8px 12px",
            }}
          >
            <input
              ref={inputRef}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              autoComplete="off"
              style={{
                flex: 1,
                background: "transparent",
                fontSize: "14px",
                color: "#111",
                outline: "none",
                border: "none",
                minWidth: 0,
              }}
            />
            <button
              type="submit"
              disabled={!newText.trim() || sending}
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: newText.trim() && !sending ? "#4f46e5" : "#a5b4fc",
                background: "none",
                border: "none",
                cursor: newText.trim() && !sending ? "pointer" : "default",
                whiteSpace: "nowrap",
              }}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
