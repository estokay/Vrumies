import React from 'react';

const EventTokensToggle = ({ value, onChange }) => {
  return (
    <div>
      <label className="event-form-label">Token Amount</label>
      <input
        type="number"
        name="tokens"
        placeholder="Enter token amount"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default EventTokensToggle;
