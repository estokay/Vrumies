import React from 'react';

const LinkToggle = ({ activeField, formData, handleChange }) => {
  if (activeField !== 'link') return null;

  return (
    <div>
      <label className="form-label">Website Link</label>
      <input
        type="text"
        name="link"
        placeholder="e.g. www.mybusiness.com"
        value={formData.link}
        onChange={handleChange}
      />
    </div>
  );
};

export default LinkToggle;
