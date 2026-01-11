import React from 'react';

const TokensToggle = ({ activeField, formData, handleChange }) => {
  if (activeField !== 'tokens') return null;

  return (
    <div>
      <label className="form-label">Token Amount</label>
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

export default TokensToggle;
