import React from 'react';

const PostLink = ({ value, onChange }) => (
  <div>
    <label className="mpf-form-label">Website Link</label>
    <input
      type="text"
      name="link"
      placeholder="e.g. www.mybusiness.com"
      value={value}
      onChange={onChange}
    />
  </div>
);

export default PostLink;
