import React from 'react';

const PostTokens = ({ value, onChange }) => {
  return (
    <div>
      <label className="mpf-form-label">Token Amount</label>
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

export default PostTokens;
