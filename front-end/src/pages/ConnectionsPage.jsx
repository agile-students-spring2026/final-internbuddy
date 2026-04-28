import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectionsContext } from "../context/ConnectionsContext";
import "./ProfilePage.css";

export default function ConnectionsPage() {
  const navigate = useNavigate();
  const { accepted } = useContext(ConnectionsContext);

  return (
    <div className="app-shell">
      <div className="scroll-area">
        <button
          onClick={() => navigate("/profile")}
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-xl border border-[#d9d9e8] bg-white px-4 py-2 text-[16px] font-medium text-[#23235f] shadow-sm transition hover:shadow-md hover:bg-gray-50"
        >
          ← Back
        </button>

        <h2 className="page-title">Connections</h2>

        {accepted.length === 0 ? (
          <p className="about-text">No connections yet.</p>
        ) : (
            accepted.map((conn) => {
                const user = conn.otherUser || {};
                const displayName = user.name || user.email || "Unknown User";
                const avatarUrl =
                  user.image ||
                  user.avatar ||
                  `https://picsum.photos/seed/${user.id || conn.id}/100/100`;
              
                return (
                  <div key={conn.id} className="request-card">
                    <img
                      className="req-avatar object-cover"
                      src={avatarUrl}
                      alt={displayName}
                    />
              
                    <div className="req-info">
                      <p className="req-name">{displayName}</p>
                      <p className="req-role">
                        {user.role || user.internship || "InternBuddy user"}
                      </p>
                    </div>
                  </div>
                );
              })
        )}
      </div>
    </div>
  );
}