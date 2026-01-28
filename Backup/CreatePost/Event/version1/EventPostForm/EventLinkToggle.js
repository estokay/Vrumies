import React from 'react';

const EventLinkToggle = ({ value, onChange }) => {
  return (
    <div>
      <label className="event-form-label">Website Link</label>
      <input
        type="text"
        name="link"
        placeholder="Enter link"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default EventLinkToggle;
