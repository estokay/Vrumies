import React from 'react';

const PostTokens = ({ formData, handleChange }) => {
  return (
    <div>
      <label className="directory-form-label">Token Amount</label>
      <input
        type="number"
        name="tokens"
        placeholder="Enter token amount"
        value={formData.tokens}
        onChange={handleChange}
      />
    </div>
  );
};

export default PostTokens;
