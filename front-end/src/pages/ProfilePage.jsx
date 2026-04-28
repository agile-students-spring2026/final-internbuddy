import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectionsContext } from "../context/ConnectionsContext";
import "./ProfilePage.css";

const ALL_INTERESTS = [
  "🎾 Tennis",
  "☕ Cafes",
  "🎵 Concerts",
  "🎮 Gaming",
  "📷 Photography",
  "✈️ Travel",
  "🍕 Foodie",
  "📚 Reading",
  "🧗 Climbing",
  "🎨 Art",
  "🎤 Karaoke",
  "🏊 Swimming",
];

const emptyProfile = {
  name: "",
  major: "",
  internship: "",
  location: "",
  city: "",
  about: "",
  interests: [],
  personality: "",
  resumeFileName: "",
  resumeUploadedAt: "",
  resumeText: "",
  connections: 0,
  hostingEvents: [],
  attendingEvents: [],
};

const emptyAccount = {
  email: "",
  phone: "",
};

export default function ProfilePage() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(emptyProfile);
  const [accountData, setAccountData] = useState(emptyAccount);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(emptyProfile);
  const [showInterestPicker, setShowInterestPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [resumeExpanded, setResumeExpanded] = useState(false);

  const { pending: friendRequests, acceptRequest, rejectRequest } = useContext(ConnectionsContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setPageError("");

        const token = localStorage.getItem("token");
        if (!token) {
          setPageError("You must be logged in to view your profile.");
          setLoading(false);
          return;
        }

        const [profileRes, authRes] = await Promise.all([
          fetch("/api/profile/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const profileJson = await profileRes.json();
        const authJson = await authRes.json();

        if (!profileRes.ok) {
          console.error(profileJson);
          setPageError(profileJson.error || "Failed to load profile");
          setLoading(false);
          return;
        }

        if (!authRes.ok) {
          console.error(authJson);
          setPageError(authJson.error || "Failed to load account");
          setLoading(false);
          return;
        }

        const backendProfile = profileJson.profile || {};
        const backendUser = authJson.user || {};

        const mappedProfile = {
          name: backendProfile.name || "",
          major: backendProfile.major || "",
          internship:
            backendProfile.internship ||
            [backendProfile.jobTitle, backendProfile.company].filter(Boolean).join(" @ "),
          location:
            backendProfile.location ||
            [backendProfile.city].filter(Boolean).join(" | "),
          city: backendProfile.city || "",
          about: backendProfile.about || "",
          interests: backendProfile.interests || [],
          personality: backendProfile.personality || "",
          resumeFileName: backendProfile.resumeFileName || "",
          resumeUploadedAt: backendProfile.resumeUploadedAt || "",
          resumeText: backendProfile.resumeText || "",
          connections: backendProfile.connections || 0,
          hostingEvents: backendProfile.hostingEvents || [],
          attendingEvents: backendProfile.attendingEvents || [],
        };

        const mappedAccount = {
          email: backendUser.email || "",
          phone: backendUser.phone || "",
        };

        setProfileData(mappedProfile);
        setAccountData(mappedAccount);
      } catch (err) {
        console.error(err);
        setPageError("Something went wrong while loading your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('internbuddy.profileData');
  
    navigate('/');
  };

  const openEdit = () => {
    setDraft({ ...profileData });
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setShowInterestPicker(false);
  };

  const toggleInterest = (interest) => {
    const current = draft.interests || [];
    if (current.includes(interest)) {
      setDraft({ ...draft, interests: current.filter((i) => i !== interest) });
    } else if (current.length < 8) {
      setDraft({ ...draft, interests: [...current, interest] });
    }
  };

  const saveEdit = async () => {
    try {
      setSaving(true);
      setPageError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setPageError("You must be logged in to save profile changes.");
        setSaving(false);
        return;
      }

      const payload = {
        name: draft.name,
        major: draft.major,
        internship: draft.internship,
        location: draft.location,
        about: draft.about,
        interests: draft.interests,
        personality: draft.personality,
        city: draft.city,
        resumeFileName: draft.resumeFileName,
        resumeUploadedAt: draft.resumeUploadedAt,
        resumeText: draft.resumeText,
      };

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        setPageError(data.error || "Failed to save profile");
        setSaving(false);
        return;
      }

      const saved = data.profile || {};

      const mappedProfile = {
        name: saved.name || "",
        major: saved.major || "",
        internship:
          saved.internship ||
          [saved.jobTitle, saved.company].filter(Boolean).join(" @ "),
        location:
          saved.location ||
          [saved.city].filter(Boolean).join(" | "),
        city: saved.city || "",
        about: saved.about || "",
        interests: saved.interests || [],
        personality: saved.personality || "",
        resumeFileName: saved.resumeFileName || "",
        resumeUploadedAt: saved.resumeUploadedAt || "",
        resumeText: saved.resumeText || "",
        connections: saved.connections || 0,
        hostingEvents: saved.hostingEvents || [],
        attendingEvents: saved.attendingEvents || [],
      };

      setProfileData(mappedProfile);
      setEditMode(false);
      setShowInterestPicker(false);
    } catch (err) {
      console.error(err);
      setPageError("Something went wrong while saving your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <div className="scroll-area">
          <p className="about-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (pageError && !editMode && !profileData.name && !profileData.about) {
    return (
      <div className="app-shell">
        <div className="scroll-area">
          <p className="about-text">{pageError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="profile-top-bar">
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 shadow-sm 
           text-[13px] font-semibold 
           text-[color:var(--profile-ink-muted)] 
           hover:bg-gray-50"
        >
          Logout
        </button>

        <button
          className="settings-icon-btn"
          onClick={() => navigate("/settings")}
          aria-label="Open settings"
        >
          ⚙
        </button>
      </div>

      {editMode && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">Edit Profile</h2>

            <label className="field-label">Name</label>
            <input
              className="field-input"
              value={draft.name || ""}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />

            <label className="field-label">Major / School</label>
            <input
              className="field-input"
              value={draft.major || ""}
              onChange={(e) => setDraft({ ...draft, major: e.target.value })}
            />

            <label className="field-label">Internship</label>
            <input
              className="field-input"
              value={draft.internship || ""}
              onChange={(e) => setDraft({ ...draft, internship: e.target.value })}
            />

            <label className="field-label">Location & Dates</label>
            <input
              className="field-input"
              value={draft.location || ""}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            />

            <label className="field-label">About</label>
            <textarea
              className="field-input field-textarea"
              value={draft.about || ""}
              onChange={(e) => setDraft({ ...draft, about: e.target.value })}
            />

            <label className="field-label">Personality Type</label>
            <input
              className="field-input"
              value={draft.personality || ""}
              onChange={(e) => setDraft({ ...draft, personality: e.target.value })}
            />

            <label className="field-label">
              Interests ({(draft.interests || []).length}/8)
            </label>
            <button
              className="chip-btn"
              type="button"
              onClick={() => setShowInterestPicker(!showInterestPicker)}
            >
              {showInterestPicker ? "Done picking" : "Edit Interests choose here"}
            </button>

            {showInterestPicker && (
              <div className="interest-grid">
                {ALL_INTERESTS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    className={`interest-chip ${(draft.interests || []).includes(i) ? "selected yipee" : ""}`}
                    onClick={() => toggleInterest(i)}
                  >
                    {i}
                  </button>
                ))}
              </div>
            )}

            {pageError && <p className="text-red-500 text-sm mt-3">{pageError}</p>}

            <div className="modal-actions">
              <button className="btn-secondary" onClick={cancelEdit} disabled={saving}>
                Cancel
              </button>
              <button className="btn-primary" onClick={saveEdit} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="scroll-area">
        {activeTab === "profile" && (
          <>
            <div className="hero-card">
              <div className="avatar-ring">
                <div className="avatar">
                  <span>ME</span>
                </div>
              </div>
              <div className="hero-info">
                <h1 className="hero-name">{profileData.name || "Your Name"}</h1>
                <p className="hero-detail">{profileData.major || "Add your school / major"}</p>
                <p className="hero-detail accent">
                  {profileData.internship || "Add your internship"}
                </p>
                <p className="hero-detail muted">
                  {profileData.location || "Add your location"}
                </p>
              </div>
            </div>

            <div className="connections-row">
              <div className="conn-badge">
                <span className="conn-num">{profileData.connections}</span>
                <span className="conn-label">Connections</span>
              </div>
            </div>

            <div className="action-row">
              <button
                className="action-btn outline"
                onClick={() => setActiveTab("requests")}
              >
                Friend Requests
              </button>
              <button className="action-btn filled" onClick={openEdit}>
                Edit Profile
              </button>
            </div>

            {pageError && <p className="text-red-500 text-sm mt-3">{pageError}</p>}

            <section className="card">
              <h3 className="section-heading">About me</h3>
              <p className="about-text">{profileData.about || "Tell people about yourself."}</p>
            </section>

            <section className="card">
              <h3 className="section-heading">Contact</h3>
              <p className="about-text">Email: {accountData.email || "Not provided"}</p>
              <p className="about-text">Phone: {accountData.phone || "Not provided"}</p>
            </section>

            <section className="card">
              <h3 className="section-heading">Interests</h3>
              <div className="tags-wrap">
                {(profileData.interests || []).map((i) => (
                  <span key={i} className="tag">
                    {i}
                  </span>
                ))}
                <button className="tag tag-add" onClick={openEdit}>
                  + Add
                </button>
              </div>
            </section>

            <section className="card personality-card">
              <span className="personality-label">Personality Type</span>
              <span className="personality-badge">
                {profileData.personality || "Not set"}
              </span>
            </section>

            <section className="card events-card">
              <h3 className="events-heading">Your Events</h3>
              <div className="events-col">
                <h4 className="events-sub">Hosting</h4>
                <ul className="event-list">
                  {(profileData.hostingEvents || []).map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>

                <h4 className="events-sub">Attending</h4>
                <ul className="event-list">
                  {(profileData.attendingEvents || []).map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="card resume-card">
              <h3 className="section-heading">Resume</h3>

              {!profileData.resumeFileName && (
                <p className="about-text">No resume uploaded yet.</p>
              )}

              {profileData.resumeFileName && !resumeExpanded && (
                <button
                  type="button"
                  className="resume-preview-btn"
                  onClick={() => setResumeExpanded(true)}
                >
                  <span className="resume-doc-icon">📄</span>
                  <span className="resume-file-name">{profileData.resumeFileName}</span>
                </button>
              )}

              {profileData.resumeFileName && resumeExpanded && (
                <div className="resume-expanded">
                  <button
                    type="button"
                    className="resume-back-btn"
                    onClick={() => setResumeExpanded(false)}
                  >
                    ← Back
                  </button>

                  <p className="about-text"><strong>File:</strong> {profileData.resumeFileName}</p>
                  <p className="about-text">
                    <strong>Uploaded:</strong>{' '}
                    {profileData.resumeUploadedAt
                      ? new Date(profileData.resumeUploadedAt).toLocaleString()
                      : 'Unknown'}
                  </p>
                  <p className="about-text">{profileData.resumeText || 'No preview available.'}</p>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === "requests" && (
          <div className="requests-page">
            <button
              onClick={() => setActiveTab("profile")}
              className="mb-6 inline-flex w-fit items-center gap-2 rounded-xl border border-[#d9d9e8] bg-white px-4 py-2 text-[16px] font-medium text-[#23235f] shadow-sm transition hover:shadow-md hover:bg-gray-50"
            >
              <span className="text-[18px] leading-none">←</span>
              <span>Back</span>
            </button>

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