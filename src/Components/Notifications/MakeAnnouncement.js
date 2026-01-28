import React, { useState } from "react";
import SendNotificationAnnouncement from "./SendNotificationAnnouncement";
import "./MakeAnnouncement.css";

function MakeAnnouncement() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");

  const [sendKey, setSendKey] = useState(0);
  const [status, setStatus] = useState("idle"); 
  // idle | sending | success | error

  const handleSend = () => {
    if (!title.trim() || !message.trim()) {
      alert("Title and message are required.");
      return;
    }

    setStatus("sending");
    setSendKey((k) => k + 1); // force remount
  };

  const handleReset = () => {
    setTitle("");
    setMessage("");
    setUserId("");
    setStatus("idle");
  };

  return (
    <div className="make-announcement">
      <h2 className="announcement-heading">📢 Make Announcement</h2>

      <input
        type="text"
        placeholder="User ID (optional — leave blank for all users)"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="announcement-input"
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

      {/* STATUS FEEDBACK */}
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

      {/* Fire-and-forget sender */}
      {status === "sending" && (
        <SendNotificationAnnouncement
          key={sendKey}
          userId={userId.trim() || undefined}
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