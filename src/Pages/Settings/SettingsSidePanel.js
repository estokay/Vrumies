import React, { useState } from "react";
import { FaCode, FaUserTie } from "react-icons/fa";
import "./SettingsSidePanel.css";

export default function SettingsSidePanel({ onSelect }) {
  const [selected, setSelected] = useState("referral");

  const handleSelect = (option) => {
    setSelected(option);
    if (onSelect) onSelect(option);
  };

  return (
    <div className="settings-panel">
      <h2 className="settings-title">
        <span>Manage</span>
      </h2>

      {/* Referral Code Button */}
      <button
        className={`settings-btn ${selected === "referral" ? "active" : ""}`}
        onClick={() => handleSelect("referral")}
      >
        <FaCode className="settings-icon" />
        <span>Vrumies Referral Code</span>
      </button>

      {/* Blocked Users Button */}
      <button
        className={`settings-btn ${selected === "blocked" ? "active" : ""}`}
        onClick={() => handleSelect("blocked")}
      >
        <FaUserTie className="settings-icon" />
        <span>Blocked Users</span>
      </button>
    </div>
  );
}
