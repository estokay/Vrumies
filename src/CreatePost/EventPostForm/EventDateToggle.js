import React from 'react';

const EventDateToggle = ({ value, onChange }) => {
  return (
    <input
      type="datetime-local"
      name="eventDateTime"
      value={value}
      onChange={onChange}
      className="event-datetime-input"
    />
  );
};

export default EventDateToggle;
