import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import { Timestamp } from 'firebase/firestore';
import { getTimeZones } from '@vvo/tzdb';
import moment from 'moment-timezone';
import 'flatpickr/dist/flatpickr.min.css';
import './EventInfoToggle.css';

const EventInfoToggle = ({ eventAddress, eventDateTime, timezone, onChange }) => {
  // Convert Timestamp to JS Date
  const jsDate = eventDateTime ? eventDateTime.toDate() : null;

  const [selectedTimezone, setSelectedTimezone] = useState(
    timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [timezones, setTimezones] = useState([]);

  useEffect(() => {
    setTimezones(getTimeZones({ includeUtc: true }));
  }, []);

  // Function to update timestamp according to selected timezone
  const updateTimestamp = (date) => {
    if (!date) return;

    // Convert date in selectedTimezone to UTC
    const m = moment.tz(date, selectedTimezone);
    const utcDate = m.toDate(); // JS Date in UTC

    onChange({
      target: { name: 'eventDateTime', value: Timestamp.fromDate(utcDate) },
    });
  };

  // Merge only the date (year, month, day)
  const mergeDate = (newDate) => {
    if (!newDate) return;

    const base = eventDateTime ? new Date(eventDateTime.toDate()) : new Date();
    base.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());

    updateTimestamp(base);
  };

  // Merge only the time (hours, minutes)
  const mergeTime = (newTime) => {
    if (!newTime) return;

    const base = eventDateTime ? new Date(eventDateTime.toDate()) : new Date();
    base.setHours(newTime.getHours(), newTime.getMinutes(), 0, 0);

    updateTimestamp(base);
  };

  // When timezone changes, re-save the timestamp using the new timezone
  useEffect(() => {
    if (jsDate) updateTimestamp(jsDate);
  }, [selectedTimezone]);

  return (
    <div className="event-post-form">
      <label className="event-form-label">Event Address</label>
      <input
        name="eventAddress"
        value={eventAddress || ''}
        onChange={onChange}
        className="event-input"
      />

      <label className="event-form-label">Event Date (Click on calendar to edit)</label>
      <Flatpickr
        value={jsDate}
        onChange={([date]) => mergeDate(date)}
        options={{ inline: true, dateFormat: 'F j, Y' }}
      />

      <label className="event-form-label">Event Time (Click on clock to edit)</label>
      <Flatpickr
        value={jsDate}
        onChange={([time]) => mergeTime(time)}
        options={{ enableTime: true, noCalendar: true, inline: true, dateFormat: 'h:i K' }}
      />

      <label className="event-form-label">Timezone</label>
      <select
        value={selectedTimezone}
        onChange={(e) => setSelectedTimezone(e.target.value)}
      >
        {timezones.map((tz) => (
          <option key={tz.name} value={tz.name}>
            {tz.currentTimeFormat} — {tz.alternativeName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EventInfoToggle;