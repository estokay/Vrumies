import React, { useEffect, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import "./CalendarDateRangeOverlay.css";

export default function CalendarDateRangeOverlay({
  range,
  setRange,
  onClose
}) {
  const overlayRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // ⭐ NEW: Handle selection logic
  const handleSelect = (newRange) => {
    setRange(newRange);

    // ONLY close if both FROM and TO exist
    if (newRange?.from && newRange?.to) {
      // Keep it open until both selected
      // Remove auto-close here or handle with a separate Apply button
      // onClose(); // <-- remove this line
    }
  };

  return (
    <div className="calendar-overlay-backdrop">
      <div className="calendar-overlay" ref={overlayRef}>
        
        <div className="calendar-header">
          <h3>Select Date Range</h3>
          <button
            className="calendar-x-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="calendar-body">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </div>

        <div className="calendar-footer">
          <button
            className="calendar-apply-btn"
            onClick={onClose}
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  );
}