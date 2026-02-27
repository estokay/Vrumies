import React from 'react';
import useUserTokens from "../../Hooks/useUserTokens";
import { auth } from "../../Components/firebase";
import HelpPopover from '../../Components/HelpPopover';

const TokensToggle = ({ formData, handleChange }) => {
  const user = auth.currentUser;
  const userId = user?.uid;

  const tokenBalance = useUserTokens(userId) ?? 0;

  const handleInputChange = (e) => {
    let val = Number(e.target.value) || 0;

    // Prevent going above tokenBalance
    if (val > tokenBalance) val = tokenBalance;

    // Call parent onChange with capped value
    handleChange({ target: { name: "tokens", value: val } });
  };

  return (
    <div>

      <label className="form-label">Token Amount (Optional) <HelpPopover text="Tokens are used to boost visibility. You cannot post more tokens than you currently own." /></label>
      <input
        type="number"
        name="tokens"
        value={formData.tokens}
        onChange={handleInputChange}
        min={0}
        max={tokenBalance}
      />

      <div style={{ marginTop: "6px", fontSize: "14px", fontWeight: "bold", color: "#ffffff" }}>
        Your token balance: {tokenBalance ?? 0}
      </div>
    </div>
  );
};

export default TokensToggle;
