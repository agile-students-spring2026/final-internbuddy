import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import "./ProfilePage.css";

const ALL_INTERESTS = [
  "🎾 Tennis","☕ Cafes","🎵 Concerts","🎮 Gaming","📷 Photography",
  "✈️ Travel","🍕 Foodie","📚 Reading","🧗 Climbing","🎨 Art","🎤 Karaoke","🏊 Swimming",
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, account, updateProfile, updateAccount } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [draftAccount, setDraftAccount] = useState(account);
  const [showInterestPicker, setShowInterestPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [friendRequests] = useState([
    { id: 1, name: "Alex Chen", role: "pm intern @ Meta", mutual: 4 },
    { id: 2, name: "Priya S.", role: "design intern @ Figma", mutual: 2 },
  ]);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  useEffect(() => {
    setDraftAccount(account);
  }, [account]);

  const openEdit = () => {
    setDraft({ ...profile });
    setDraftAccount({ ...account });
    setEditMode(true);
  };

  const saveEdit = () => {
    updateProfile({ ...draft });
    updateAccount({ ...draftAccount });
    setEditMode(false);
    setShowInterestPicker(false);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setShowInterestPicker(false);
  };

  const toggleInterest = (interest) => {
    const current = draft.interests;
    if (current.includes(interest)) {
      setDraft({ ...draft, interests: current.filter((i) => i !== interest) });
    } else if (current.length < 8) {
      setDraft({ ...draft, interests: [...current, interest] });
    }
  };

  const addLookingFor = () => {
    const label = prompt("What are you looking for?");
    const emoji = prompt("Pick an emoji: any emoji that makes you happy and represents you ");
    if (label && emoji) {
      setDraft({ ...draft, lookingFor: [...draft.lookingFor, { emoji, label }] });
    }
  };

  return (
    <div className="app-shell">
      <div className="profile-top-bar">
        <button className="settings-icon-btn" onClick={() => navigate("/settings")} aria-label="Open settings">
          ⚙
        </button>
      </div>

      {/* ── EDIT MODAL ── */}
      {editMode && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">Edit Profile</h2>

            <label className="field-label">Name</label>
            <input className="field-input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />

            <label className="field-label">Major / School</label>
            <input className="field-input" value={draft.major} onChange={(e) => setDraft({ ...draft, major: e.target.value })} />

            <label className="field-label">Internship</label>
            <input className="field-input" value={draft.internship} onChange={(e) => setDraft({ ...draft, internship: e.target.value })} />

            <label className="field-label">Location & Dates</label>
            <input className="field-input" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />

            <label className="field-label">About</label>
            <textarea className="field-input field-textarea" value={draft.about} onChange={(e) => setDraft({ ...draft, about: e.target.value })} />

            <label className="field-label">Email</label>
            <input className="field-input" value={draftAccount.email} onChange={(e) => setDraftAccount({ ...draftAccount, email: e.target.value })} />

            <label className="field-label">Country Code</label>
            <input className="field-input" value={draftAccount.countryCode || ''} onChange={(e) => setDraftAccount({ ...draftAccount, countryCode: e.target.value })} />

            <label className="field-label">Phone</label>
            <input className="field-input" value={draftAccount.phoneNumber || ''} onChange={(e) => setDraftAccount({ ...draftAccount, phoneNumber: e.target.value })} />

            <label className="field-label">Personality Type</label>
            <input className="field-input" value={draft.personality} onChange={(e) => setDraft({ ...draft, personality: e.target.value })} />

            <label className="field-label">Interests ({draft.interests.length}/8)</label>
            <button className="chip-btn" onClick={() => setShowInterestPicker(!showInterestPicker)}>
              {showInterestPicker ? "Done picking" : "Edit Interests choose here"}
            </button>
            {showInterestPicker && (
              <div className="interest-grid">
                {ALL_INTERESTS.map((i) => (
                  <button
                    key={i}
                    className={`interest-chip ${draft.interests.includes(i) ? "selected yipee" : ""}`}
                    onClick={() => toggleInterest(i)}
                  >
                    {i}
                  </button>
                ))}
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-secondary" onClick={cancelEdit}>Cancel</button>
              <button className="btn-primary" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="scroll-area">
        {activeTab === "profile" && (
          <>
            {/* HERO CARD */}
            <div className="hero-card">
              <div className="avatar-ring">
                <div className="avatar">
                  <span>ME</span>
                </div>
              </div>
              <div className="hero-info">
                <h1 className="hero-name">{profile.name}</h1>
                <p className="hero-detail">{profile.major}</p>
                <p className="hero-detail accent">{profile.internship}</p>
                <p className="hero-detail muted">{profile.location}</p>
              </div>
            </div>

            {/* CONNECTIONS ROW */}
            <div className="connections-row">
              <div className="conn-badge">
                <span className="conn-num">{profile.connections}</span>
                <span className="conn-label">Connections</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="action-row">
              <button className="action-btn outline" onClick={() => setActiveTab("requests")}>
                Friend Requests
              </button>
              <button className="action-btn filled" onClick={openEdit}>
                Edit Profile
              </button>
            </div>

            {/* ABOUT */}
            <section className="card">
              <h3 className="section-heading">About me</h3>
              <p className="about-text">{profile.about}</p>
            </section>

            <section className="card">
              <h3 className="section-heading">Contact</h3>
              <p className="about-text">Email: {account.email || 'Not provided'}</p>
              <p className="about-text">Phone: {account.phoneNumber ? `${account.countryCode} ${account.phoneNumber}` : 'Not provided'}</p>
            </section>

            {/* INTERESTS */}
            <section className="card">
              <h3 className="section-heading">Interests</h3>
              <div className="tags-wrap">
                {profile.interests.map((i) => (
                  <span key={i} className="tag">{i}</span>
                ))}
                <button className="tag tag-add" onClick={openEdit}>+ Add</button>
              </div>
            </section>

            {/* PERSONALITY */}
            <section className="card personality-card">
              <span className="personality-label">Personality Type</span>
              <span className="personality-badge">{profile.personality}</span>
            </section>

            {/* LOOKING FOR */}
            <section className="card">
              <h3 className="section-heading">Looking For</h3>
              <ul className="looking-list">
                {profile.lookingFor.map((l, idx) => (
                  <li key={idx} className="looking-item">
                    <span className="looking-emoji">{l.emoji}</span>
                    {l.label}
                  </li>
                ))}
              </ul>
            </section>

            {/* EVENTS */}
            <section className="card events-card">
              <h3 className="events-heading">Your Events</h3>
              <div className="events-col">
                <h4 className="events-sub">Hosting</h4>
                <ul className="event-list">
                  {profile.hostingEvents.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
                <h4 className="events-sub">Attending</h4>
                <ul className="event-list">
                  {profile.attendingEvents.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}

        {activeTab === "requests" && (
          <div className="requests-page">
            <h2 className="page-title">Friend Requests</h2>
            {friendRequests.map((r) => (
              <div key={r.id} className="request-card">
                <div className="req-avatar">{r.name[0]}</div>
                <div className="req-info">
                  <p className="req-name">{r.name}</p>
                  <p className="req-role">{r.role}</p>
                  <p className="req-mutual">{r.mutual} mutual connections</p>
                </div>
                <div className="req-actions">
                  <button className="btn-primary small">Accept</button>
                  <button className="btn-ghost small">Ignore</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
