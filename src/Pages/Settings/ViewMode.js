import React, { useState, useEffect } from "react";
import "./ViewMode.css";
import { isMobileOnly } from 'react-device-detect';

export default function ViewMode() {
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("viewMode") || "auto";
  });

  const options = [
    {
      key: "auto",
      label: "Auto",
      description:
        "Automatically detects device and displays in Desktop or Mobile",
    },
    {
      key: "desktop",
      label: "Desktop",
      description: "Display in desktop mode only.",
    },
    {
      key: "mobile",
      label: "Mobile",
      description: "Display in mobile mode only.",
    },
  ];

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  return (
    <div className="viewmode-section-container">
      <h2 className="viewmode-section-title">View Mode Options</h2>

      <div className="viewmode-toggle">
        {options.map((opt) => (
          <button
            key={opt.key}
            className={`viewmode-option ${
              viewMode === opt.key ? "active" : ""
            }`}
            onClick={() => setViewMode(opt.key)}
          >
            <span className="viewmode-label">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="viewmode-description">
        {options.find((opt) => opt.key === viewMode)?.description}
      </div>

      <div className="viewmode-detection">
        Current device detected: {isMobileOnly ? "You are on a phone." : "You are on a tablet or desktop."}
      </div>
    </div>
  );
}