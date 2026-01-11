import React from 'react';

const PostLink = ({ formData, handleChange }) => {
  return (
    <div>
      <label className="directory-form-label">Website Link</label>
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

export default PostLink;
