import React from 'react';

const LinkField = ({ link, handleChange }) => {
  return (
    <div>
      <label className="form-label">Website Link</label>
      <input
        type="text"
        name="link"
        placeholder="e.g. www.mybusiness.com"
        value={link}
        onChange={handleChange}
      />
    </div>
  );
};

export default LinkField;
