import { useNavigate } from "react-router-dom";

const conversation = {
  id: "c1",
  otherUser: {
    id: "u2",
    name: "John Green",
    username: "jgreen",
    avatar: "https://picsum.photos/seed/jgreen/100/100",
    subtitle: "SWE Intern @ Google",
  },
};

const messages = [
  { id: 1, sender: "them", text: "Hey! Are you free later this week?" },
  { id: 2, sender: "me", text: "Yeah probably, what’s up?" },
  { id: 3, sender: "them", text: "Wanted to grab coffee and talk internships." },
  { id: 4, sender: "me", text: "I’m down." },
];

export default function DirectMessagePage() {
  const navigate = useNavigate();

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

        {/* Input (disabled) */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <input
              disabled
              placeholder="Messaging coming soon..."
              className="flex-1 bg-transparent text-sm text-gray-400 outline-none"
            />
            <button
              disabled
              className="text-xs text-gray-400"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}