import React from 'react';

const TokensField = ({ tokens, handleChange }) => {
  return (
    <div>
      <label className="form-label">Token Amount</label>
      <input
        type="number"
        name="tokens"
        placeholder="Enter token amount"
        value={tokens}
        onChange={handleChange}
      />
    </div>
  );
};

export default TokensField;
