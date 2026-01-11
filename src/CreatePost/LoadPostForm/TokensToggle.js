import React from 'react';

const TokensToggle = ({ formData, handleChange }) => {
  return (
    <div>
      <label className="form-label">Token Amount</label>
      <input
        type="number"
        name="tokens"
        value={formData.tokens}
        onChange={handleChange}
      />
    </div>
  );
};

export default TokensToggle;
