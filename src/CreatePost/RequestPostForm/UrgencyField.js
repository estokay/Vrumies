import React from 'react';

const UrgencyField = ({ urgency, handleChange }) => {
  return (
    <div>
    <label className="form-label">Urgency</label>
    <select
      name="urgency"
      value={urgency}
      onChange={handleChange}
      className="urgency-select"
    >
      <option value="Urgent">Urgent</option>
      <option value="I Can Wait">I Can Wait</option>
      <option value="Just Looking">Just Looking</option>
    </select>
    </div>
  );
};

export default UrgencyField;
