import React from 'react';

const BlogPostTokens = ({ value, onChange }) => {
  return (
    <div>
      <label className="form-label">Token Amount</label>
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

export default BlogPostTokens;
