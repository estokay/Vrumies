import React from "react";
import "./ReferralCode.css";

export default function ReferralCode() {
  return (
    <div className="referral-container">
      <h2 className="referral-title">Vrumies Referral Code</h2>
      <p className="referral-text">Your personal referral code is:</p>
      <div className="referral-code-box">ABC123</div>
      <button className="copy-btn">Copy Code</button>
    </div>
  );
}
