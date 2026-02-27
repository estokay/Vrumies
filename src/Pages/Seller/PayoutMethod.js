import React, { useState } from "react";
import "./PayoutMethod.css";
import { auth } from "../../Components/firebase";
import useGetSellerBalances from "../../Hooks/useGetSellerBalances";
import useGetUsername from "../../Hooks/useGetUsername";
import useGetUserEmail from "../../Hooks/useGetUserEmail";
import PaymentInformationOverlay from "../../Components/Overlays/PaymentInformationOverlay";

export default function PayoutMethod() {
  const user = auth.currentUser;
  const userId = user?.uid;

  const { available, sent, loading, error } = useGetSellerBalances();

  const sellerName = useGetUsername(userId);
  const { email: sellerEmail } = useGetUserEmail(userId);
  const [showPayoutInfo, setShowPayoutInfo] = useState(false);

  if (loading) {
    return <div style={{ color: "#aaa" }}>Loading Stripe balances...</div>;
  }

  return (
    <div className="payoutmethods-container">
      <div className="payoutmethods-title">PAYOUT INFORMATION</div>

      {/* MAIN CONTENT */}
      <div className="payoutmethods-content">
        {/* LEFT COLUMN */}
        <div className="payoutmethods-left">
          <img
            className="payoutmethods-logo"
            src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1772014958/8733619_xgrxsl.png"
            alt="Financial Report"
          />

          <button
            className="payoutmethods-connect-btn"
            onClick={() => setShowPayoutInfo(true)}
          >
            Payout Information
          </button>

          <div className="payoutmethods-bank-status">
            Seller:{" "}
            
            <span className="payoutmethods-red">{sellerName}</span>
            
            <br />
            Email:{" "}
            
            <span className="payoutmethods-red">{sellerEmail}</span>
            
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="payoutmethods-right">
          <div className="payoutmethods-balance-row">
            <div className="payoutmethods-balance-card available">
              <div className="payoutmethods-balance-header">
                <span>Processing</span>
                <span className="payoutmethods-badge success">Pending</span>
              </div>
              <div className="payoutmethods-balance-amount">
                ${(available ?? 0).toFixed(2)}
              </div>
              <div className="payoutmethods-balance-sub">
                Being processessed by Vrumies
              </div>
            </div>

            <div className="payoutmethods-balance-card pending">
              <div className="payoutmethods-balance-header">
                <span>Disbursed Funds</span>
                <span className="payoutmethods-badge warning">Sent</span>
              </div>
              <div className="payoutmethods-balance-amount">
                ${(sent ?? 0).toFixed(2)}
              </div>
              <div className="payoutmethods-balance-sub">
                Payouts links have been sent to Email
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPayoutInfo && (
        <PaymentInformationOverlay
          onClose={() => setShowPayoutInfo(false)}
        />
      )}
    </div>
  );
}