import React, { useState } from "react";
import "./AvailabilityCalendarOverlay.css";

const AvailabilityCalendarOverlay = ({ onClose }) => {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(today);

  const availability = {
    "2026-06-01": [9, 10, 11, 14, 15, 16],
    "2026-06-02": [8, 9, 13, 14, 17, 18],
    "2026-06-03": [10, 11, 12, 15, 16],
  };

  const dateKey = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  const availableHours = availability[dateKey] || [];

  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:00 ${period}`;
  };

  return (
    <div className="aco-backdrop" onClick={onClose}>
      <div
        className="aco-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aco-header">
          <h2>Availability Calendar</h2>

          <button
            className="aco-close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="aco-content">

          {/* Calendar */}

          <div className="aco-calendar-panel">

            <h3>
              {today.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h3>

            <div className="aco-calendar-grid">

              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;

                const currentDate = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  day
                );

                const key = `${currentDate.getFullYear()}-${String(
                  currentDate.getMonth() + 1
                ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
                const hasAvailability = (availability[key] || []).length > 0;

                const selected =
                  selectedDate.toDateString() ===
                  currentDate.toDateString();

                return (
                  <button
                    key={day}
                    className={`aco-day 
                      ${hasAvailability ? "has-availability" : ""} 
                      ${selected ? "selected" : ""} 
                    `}
                    onClick={() => setSelectedDate(currentDate)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Schedule */}

          <div className="aco-schedule-panel">

            <h3>
              {selectedDate.toLocaleDateString()}
            </h3>

            <div className="aco-hours">

              {Array.from({ length: 24 }).map((_, hour) => {

                const available =
                  availableHours.includes(hour);

                return (
                  <div
                    key={hour}
                    className={`aco-hour-block ${
                      available
                        ? "available"
                        : "unavailable"
                    }`}
                  >
                    <span>
                      {formatHour(hour)}
                    </span>

                    <span>
                      {available
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>
                );
              })}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendarOverlay;