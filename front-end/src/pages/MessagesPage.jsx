import ConversationList from "../components/ConversationList";

const mockConversations = [
  {
    id: "c1",
    otherUser: {
      id: "u2",
      name: "John Green",
      username: "jgreen",
      avatar: "https://picsum.photos/seed/jgreen/100/100",
      subtitle: "SWE Intern @ Google",
    },
    lastMessage: "Sounds good, let’s figure something out this week.",
    timestamp: "2h",
    unreadCount: 1,
  },
//   {
//     id: "c2",
//     otherUser: {
//       id: "u3",
//       name: "Elon Musk",
//       username: "emusk",
//       avatar: "https://picsum.photos/seed/emusk/100/100",
//       subtitle: "PM Intern @ Amazon",
//     },
//     lastMessage: "I’m down to grab coffee after work.",
//     timestamp: "1d",
//     unreadCount: 0,
//   },
//   {
//     id: "c3",
//     otherUser: {
//       id: "u4",
//       name: "Andy Jassy",
//       username: "ajassy",
//       avatar: "https://picsum.photos/seed/ajassy/100/100",
//       subtitle: "CS @ NYU",
//     },
//     lastMessage: "Are you going to the intern meetup?",
//     timestamp: "3d",
//     unreadCount: 0,
//   },
];

export default function MessagesPage() {
    const handleConversationClick = (conversation) => {
      console.log("Open conversation:", conversation.id);
    };
  
    return (
      <div className="flex justify-center">
        <div className="max-w-[390px]">
          <ConversationList
            conversations={mockConversations}
            onConversationClick={handleConversationClick}
          />
        </div>
      </div>
    );
  }