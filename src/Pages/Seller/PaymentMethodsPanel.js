import React from "react";
import "./PaymentMethodsPanel.css";
import useGetStripeBalances from "../../Hooks/useGetStripeBalances";
import { auth } from "../../Components/firebase";

export default function PaymentMethodsPanel() {
  const user = auth.currentUser;
  const userId = user?.uid;

  const {
    available,
    pending,
    loading,
    stripeAccountId: userStripeAccount,
  } = useGetStripeBalances(userId);

  if (loading) {
    return <div style={{ color: "#aaa" }}>Loading Stripe balances...</div>;
  }

  return (
    <div className="pmo-inline">
      <div className="pmo-stripe-title">STRIPE BALANCE</div>

      {/* MAIN CONTENT */}
      <div className="pmo-content">
        {/* LEFT COLUMN */}
        <div className="pmo-left">
          <img
            className="pmo-stripe-logo"
            src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1755541634/Stripe-Icon_f5i6vd.png"
            alt="Stripe"
          />

          <button className="pmo-connect-btn">
            {userStripeAccount ? "Manage" : "Connect"}
          </button>

          <div className="pmo-bank-status">
            Status:{" "}
            {userStripeAccount ? (
              <span className="green">Connected</span>
            ) : (
              <span className="red">Not Connected</span>
            )}
            <br />
            Stripe Account:{" "}
            {userStripeAccount ? (
              <span className="green">{userStripeAccount}</span>
            ) : (
              <span className="red">N/A</span>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="pmo-right">
          <div className="pmo-balance-row">
            <div className="pmo-balance-card available">
              <div className="pmo-balance-header">
                <span>Available</span>
                <span className="pmo-badge success">Ready</span>
              </div>
              <div className="pmo-balance-amount">
                ${(available ?? 0).toFixed(2)}
              </div>
              <div className="pmo-balance-sub">
                Can be paid out now
              </div>
            </div>

            <div className="pmo-balance-card pending">
              <div className="pmo-balance-header">
                <span>Pending</span>
                <span className="pmo-badge warning">Processing</span>
              </div>
              <div className="pmo-balance-amount">
                ${(pending ?? 0).toFixed(2)}
              </div>
              <div className="pmo-balance-sub">
                Clearing after order completion
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}