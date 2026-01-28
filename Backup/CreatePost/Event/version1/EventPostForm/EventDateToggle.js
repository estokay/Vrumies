import React from 'react';

const EventDateToggle = ({ value, onChange }) => {
  return (
    <div>
      <label className="event-form-label">Event Date</label>
      <input
        type="datetime-local"
        name="eventDateTime"
        value={value}
        onChange={onChange}
        className="event-datetime-input"
      />
    </div>
  );
};

export default EventDateToggle;
