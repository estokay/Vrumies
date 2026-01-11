import React from 'react';

const LinkToggle = ({ formData, handleChange }) => {
  return (
    <div>
      <label className="form-label">Website Link</label>
      <input
        type="text"
        name="link"
        placeholder="Enter link"
        value={formData.link}
        onChange={handleChange}
      />
    </div>
  );
};

export default LinkToggle;
