import React from 'react';

const LinkField = ({ link, handleChange }) => {
  return (
    <div>
      <label className="form-label">Website Link</label>
      <input
        type="text"
        name="link"
        placeholder="Enter link"
        value={link}
        onChange={handleChange}
      />
    </div>
  );
};

export default LinkField;
