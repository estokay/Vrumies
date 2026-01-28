import React from 'react';

const EventPriceToggle = ({ value, onChange }) => {
  return (
    <input
      type="text"
      name="price"
      placeholder="$0.00"
      value={value || ''}
      onChange={onChange}
      className="event-datetime-input"
    />
  );
};

export default EventPriceToggle;
