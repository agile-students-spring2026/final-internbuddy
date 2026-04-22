import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../utils/auth";

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

  useEffect(() => {
    fetch(`/api/messages/${id}`, { headers: authHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data && data.conversation) {
          setConversation(data.conversation);
          setMessages(data.messages || []);
        }
      })
      .catch(err => console.error('Failed to fetch messages:', err));
  }, [id]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    fetch(`/api/messages/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ text: newText }),
    })
      .then(res => res.json())
      .then(msg => {
        if (msg && msg.id) {
          setMessages(prev => [...prev, msg]);
          setNewText("");
        }
      })
      .catch(err => console.error('Failed to send message:', err));
  };

  if (!conversation) return null;

  return (
    <div className="min-h-screen bg-[#eeeef8] p-4">
      <div className="max-w-[430px] mx-auto flex flex-col h-[calc(95vh-2rem)] bg-white rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <button
            onClick={() => navigate("/messages")}
            className="text-sm text-indigo-600"
          >
            ← Back
          </button>

          <img
            src={conversation.otherUser.avatar}
            alt={conversation.otherUser.name}
            className="w-10 h-10 rounded-full"
          />

          <div>
            <p className="text-sm font-semibold">
              {conversation.otherUser.name}
            </p>
            <p className="text-xs text-gray-400">
              {conversation.otherUser.subtitle}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafafe]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm max-w-[70%] ${
                  msg.sender === "me"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
            />
            <button
              type="submit"
              className="text-xs text-indigo-600 font-semibold"
            >
              Send
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
