import React, { useState } from "react";
import SendNotificationAnnouncement from "./SendNotificationAnnouncement";
import "./MakeAnnouncement.css";

function MakeAnnouncement() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");

  // 🔹 NEW: mode toggle
  const [mode, setMode] = useState("all"); 
  // "all" | "user"

  const [sendKey, setSendKey] = useState(0);
  const [status, setStatus] = useState("idle");

  const handleSend = () => {
    if (!title.trim() || !message.trim()) {
      alert("Title and message are required.");
      return;
    }

    if (mode === "user" && !userId.trim()) {
      alert("User ID is required when sending to an individual.");
      return;
    }

    setStatus("sending");
    setSendKey((k) => k + 1);
  };

  const handleReset = () => {
    setTitle("");
    setMessage("");
    setUserId("");
    setMode("all");
    setStatus("idle");
  };

  return (
    <div className="make-announcement">
      <h2 className="announcement-heading">📢 Make Announcement</h2>

      {/* 🔹 TOGGLE */}
      <div className="announcement-toggle">
        <button
          className={`toggle-btn ${mode === "all" ? "active" : ""}`}
          onClick={() => setMode("all")}
        >
          🌍 Send to All
        </button>

        <button
          className={`toggle-btn ${mode === "user" ? "active" : ""}`}
          onClick={() => setMode("user")}
        >
          🔘 Send to User
        </button>
      </div>

      {/* 🔹 USER ID (only enabled in user mode) */}
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="announcement-input"
        disabled={mode === "all"}
      />

      <input
        type="text"
        placeholder="Announcement title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="announcement-input"
      />

      <textarea
        placeholder="Announcement message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="announcement-textarea"
      />

      <div className="announcement-actions">
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending..." : "Send Announcement"}
        </button>

        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>

      {status === "success" && (
        <p className="announcement-success">
          ✅ Announcement sent successfully
        </p>
      )}

      {status === "error" && (
        <p className="announcement-error">
          ❌ Failed to send announcement
        </p>
      )}

      {status === "sending" && (
        <SendNotificationAnnouncement
          key={sendKey}
          userId={mode === "user" ? userId.trim() : undefined}
          title={title}
          message={message}
          onSuccess={() => setStatus("success")}
          onError={() => setStatus("error")}
        />
      )}
    </div>
  );
}

export default MakeAnnouncement;