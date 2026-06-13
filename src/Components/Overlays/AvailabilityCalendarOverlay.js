import React, { useState } from "react";
import "./AvailabilityCalendarOverlay.css";
import useGetAvailabilityCalendar from "../../Hooks/useGetAvailabilityCalendar";

const AvailabilityCalendarOverlay = ({ onClose }) => {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(today);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const {
    availabilityCalendarId,
    availabilityCalendarExists,
    loading,
  } = useGetAvailabilityCalendar();

  const parseTimeToMinutes = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const formatMinutesToTime = (mins) => {
    const hours24 = Math.floor(mins / 60);
    const minutes = mins % 60;

    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

    return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  const buildDayRanges = (intervals) => {
    const DAY_START = 0;
    const DAY_END = 24 * 60;

    // convert to minutes
    const available = intervals.map((i) => ({
      start: parseTimeToMinutes(i.startTime),
      end: parseTimeToMinutes(i.endTime),
    }));

    available.sort((a, b) => a.start - b.start);

    const ranges = [];
    let cursor = DAY_START;

    for (const block of available) {
      if (block.start > cursor) {
        ranges.push({
          start: cursor,
          end: block.start,
          available: false,
        });
      }

      ranges.push({
        start: block.start,
        end: block.end,
        available: true,
      });

      cursor = block.end;
    }

    if (cursor < DAY_END) {
      ranges.push({
        start: cursor,
        end: DAY_END,
        available: false,
      });
    }

    return ranges;
  };

  const availability = {
    "2026-06-01": [
    { startTime: "11:15 AM", endTime: "1:30 PM" },
    { startTime: "2:00 PM", endTime: "3:00 PM" }
  ],
    "2026-06-02": [
    { startTime: "11:15 AM", endTime: "1:30 PM" },
    { startTime: "2:45 PM", endTime: "3:15 PM" }
  ],
    "2026-06-03": [
    { startTime: "10:15 AM", endTime: "1:30 PM" },
    { startTime: "2:30 PM", endTime: "3:00 PM" }
  ],
  };

  const dateKey = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  const availableHours = availability[dateKey] || [];
  const dayRanges = buildDayRanges(availableHours);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
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
          <div className="aco-title-group">
            <h2>Availability Calendar</h2>

            <div className="aco-calendar-id">
              Calendar Id: {availabilityCalendarId}
            </div>
          </div>

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

            <div className="aco-month-header">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                      1
                    )
                  )
                }
              >
                ←
              </button>

              <h3>
                {currentMonth.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>

              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                      1
                    )
                  )
                }
              >
                →
              </button>
            </div>

            <div className="aco-calendar-grid">

              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;

                const currentDate = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
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

              {dayRanges.map((range, idx) => (
                <div
                  key={idx}
                  className={`aco-hour-block ${
                    range.available ? "available" : "unavailable"
                  }`}
                >
                  <span>
                    {formatMinutesToTime(range.start)} - {formatMinutesToTime(range.end)}
                  </span>

                  <span>
                    {range.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              ))}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendarOverlay;