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

  return (
    <div className="calendar-overlay-backdrop">
      <div className="calendar-overlay" ref={overlayRef}>
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
        />

        <button className="calendar-close-btn" onClick={onClose}>
          Apply
        </button>
      </div>
    </div>
  );
}