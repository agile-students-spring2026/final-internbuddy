import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ConversationList from "../components/ConversationList";
import { getToken } from "../utils/auth";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const token = getToken();
    fetch('/api/messages', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setConversations(data);
      })
      .catch(err => console.error('Failed to fetch conversations:', err));
  }, [location.key]);

  return (
    <ConversationList conversations={conversations} />
  );
}
