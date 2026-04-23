// import { useMemo, useState } from "react";

// function ConversationListItem({ conversation, onConversationClick }) {
//   const { otherUser, lastMessage, timestamp, unreadCount } = conversation;

//   return (
//     <button
//       onClick={() => onConversationClick(conversation)}
//       className="flex items-center gap-3 w-full px-2.5 py-3 rounded-xl hover:bg-indigo-50 transition-colors text-left"
//     >
//       <img
//         src={otherUser.avatar}
//         alt={otherUser.name}
//         className="w-11 h-11 rounded-full object-cover shrink-0"
//       />
//       <div className="flex-1 min-w-0">
//         <p className="text-[15px] font-semibold text-gray-900 m-0">{otherUser.name}</p>
//         <p className="text-[13px] text-gray-400 truncate m-0">{lastMessage}</p>
//       </div>
//       <div className="flex flex-col items-end gap-1 shrink-0">
//         <span className="text-xs text-gray-400">{timestamp}</span>
//         {unreadCount > 0 && (
//           <span className="bg-indigo-600 text-white text-[11px] font-semibold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
//             {unreadCount}
//           </span>
//         )}
//       </div>
//     </button>
//   );
// }

// export default function ConversationList({ conversations, onConversationClick }) {
//   const [search, setSearch] = useState("");

//   const filteredConversations = useMemo(() => {
//     const query = search.toLowerCase().trim();
//     if (!query) return conversations;

//     return conversations.filter((c) =>
//       c.otherUser.name.toLowerCase().includes(query) ||
//       c.otherUser.username.toLowerCase().includes(query)
//     );
//   }, [conversations, search]);

//   return (
//     <div className="min-h-screen bg-[#eeeef8] p-4">
//       <div className="bg-white rounded-2xl p-5">
//         <h1 className="text-xl font-bold text-gray-900 mb-1">Messages</h1>
//         <p className="text-sm text-gray-400 mb-3">Chat with your connections</p>

//         <input
//           type="text"
//           placeholder="Search messages"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-indigo-500 focus:border-indigo-700 outline-none text-sm text-gray-900 mb-4"
//         />

//         <div className="flex flex-col gap-0.5">
//           {filteredConversations.map((conversation) => (
//             <ConversationListItem
//               key={conversation.id}
//               conversation={conversation}
//               onConversationClick={onConversationClick}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function ConversationListItem({ conversation, onConversationClick }) {
  const { otherUser, lastMessage, timestamp, unreadCount } = conversation;

  return (
    <button
      onClick={() => onConversationClick(conversation)}
      className="flex items-center gap-3 w-full px-2.5 py-3 rounded-xl hover:bg-indigo-50 transition-colors text-left"
    >
      <img
        src={otherUser.avatar}
        alt={otherUser.name}
        className="w-11 h-11 rounded-full object-cover shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-gray-900 m-0">
          {otherUser.name}
        </p>
        <p className="text-[13px] text-gray-400 truncate m-0">
          {lastMessage}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-xs text-gray-400">{timestamp}</span>
        {unreadCount > 0 && (
          <span className="bg-indigo-600 text-white text-[11px] font-semibold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
            {unreadCount}
          </span>
        )}
      </div>
    </button>
  );
}

export default function ConversationList({ conversations }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredConversations = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return conversations;

    return conversations.filter((c) =>
      c.otherUser.name.toLowerCase().includes(query) ||
      c.otherUser.username.toLowerCase().includes(query)
    );
  }, [conversations, search]);

  const handleConversationClick = (conversation) => {
    navigate(`/message/${conversation.id}`);
  };

  return (
    <div className="min-h-screen bg-[#eeeef8] p-4">
      <div className="mx-auto max-w-[390px] bg-white rounded-2xl p-5">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Messages</h1>
        <p className="text-sm text-gray-400 mb-3">Chat with your connections</p>

        <input
          type="text"
          placeholder="Search messages"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-indigo-500 focus:border-indigo-700 outline-none text-sm text-gray-900 mb-4"
        />

        <div className="flex flex-col gap-0.5">
          {filteredConversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              onConversationClick={handleConversationClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}