import React from "react";
import "./BlockedUsers.css";

export default function BlockedUsers() {
  const blockedUsers = [
    {
      name: "Jessica Collyard",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      note: ""
    },
    {
      name: "Rayna Culhane",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      note: ""
    },
    {
      name: "Lattisha Williams",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      note: "They kept spamming me with random messages that had nothing to do with what I was interested in."
    }
  ];

  return (
    <div className="blocked-users-container">
      <h2 className="blocked-title">Blocked Users</h2>

      <div className="block-input-row">
        <input
          type="text"
          placeholder="Insert Username to Block..."
          className="block-input"
        />
        <button className="block-btn">BLOCK USER</button>
      </div>

      {blockedUsers.map((user, idx) => (
        <div className="blocked-card" key={idx}>
          <img src={user.avatar} alt={user.name} className="blocked-avatar" />
          <div className="blocked-info">
            <h3>{user.name}</h3>
            <p className="why-block">Why did I block this user?</p>
            <textarea
              placeholder="Insert notes here..."
              defaultValue={user.note}
              className="blocked-textarea"
            />
          </div>
          <div className="unblock-section">
            <p>Unblock User?</p>
            <button className="unblock-btn">YES, UNBLOCK</button>
          </div>
        </div>
      ))}
    </div>
  );
}
