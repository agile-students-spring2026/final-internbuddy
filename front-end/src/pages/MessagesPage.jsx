import { useState, useEffect } from "react";
import ConversationList from "../components/ConversationList";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => setConversations(data))
      .catch(err => console.error('Failed to fetch conversations:', err));
  }, []);

  return (
    <div className="flex justify-center">
      <div className="max-w-[390px]">
        <ConversationList conversations={conversations} />
      </div>
    </div>
  );
}
