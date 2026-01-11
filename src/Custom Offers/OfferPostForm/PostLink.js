import React from 'react';

const PostLink = ({ value, onChange }) => {
  return (
    <div>
      <label className="mpf-form-label">Website Link</label>
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

export default PostLink;
