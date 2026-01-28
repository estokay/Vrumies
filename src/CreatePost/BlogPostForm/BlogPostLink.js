import React from 'react';

const BlogPostLink = ({ value, onChange }) => {
  return (
    <div>
      <label className="form-label">Website Link</label>
      <input
        type="text"
        name="link"
        placeholder="e.g. www.mybusiness.com"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default BlogPostLink;
