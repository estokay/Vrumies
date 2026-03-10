import React from "react";
import "./ReferralCode.css";
import { useGetUserReferralCode  } from "../../Hooks/useGetUserReferralCode";
import { auth } from "../../Components/firebase";

export default function ReferralCode() {
  const { referralCode, loading, error } = useGetUserReferralCode();
  
  const handleCopy = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      alert("Referral code copied!");
    }
  };

  return (
    <div className="referral-container">
      <h2 className="referral-title">Vrumies Referral Code</h2>
      <p className="referral-text">Your personal referral code is:</p>
      <div className="referral-code-box">
        {loading
          ? "Loading..."
          : error
          ? "Error loading code"
          : referralCode || "No referral code found"}
      </div>
      <button className="copy-btn" onClick={handleCopy}>Copy Code</button>
    </div>
  );
}
