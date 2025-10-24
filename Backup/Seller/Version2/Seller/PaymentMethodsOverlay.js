import React from "react";
import "./PaymentMethodsOverlay.css";

export default function PaymentMethodsOverlay({ onClose }) {
  return (
    <div className="pmo-overlay">
      <div className="pmo-overlay-content">
        {/* Close Button */}
        <button className="pmo-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Cash App */}
        <div className="pmo-payment-method">
          <img
            src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1755541634/CashApp-Icon_kykgyd.png"
            alt="Cash App"
          />
          <input type="text" placeholder="TYPE YOUR CASH APP USERNAME HERE..." />
          <button className="pmo-cancel-btn">Cancel</button>
          <button className="pmo-save-btn">Save</button>
        </div>

        {/* Venmo */}
        <div className="pmo-payment-method">
          <img
            src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1755541634/Venmo-Icon_wbjipo.png"
            alt="Venmo"
          />
          <input type="text" placeholder="TYPE YOUR VENMO USERNAME HERE..." />
          <button className="pmo-cancel-btn">Cancel</button>
          <button className="pmo-save-btn">Save</button>
        </div>

        {/* PayPal */}
        <div className="pmo-payment-method">
          <img
            src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1755541634/Paypal-Icon_isktt9.png"
            alt="PayPal"
          />
          <input type="text" placeholder="TYPE YOUR PAYPAL USERNAME HERE..." />
          <button className="pmo-cancel-btn">Cancel</button>
          <button className="pmo-save-btn">Save</button>
        </div>

        {/* Bank Account (Stripe) */}
        <div className="pmo-bank-method">
          <img
            src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1755541634/Stripe-Icon_f5i6vd.png"
            alt="Stripe"
          />
          <button className="pmo-connect-btn">Connect</button>
          <div className="pmo-bank-status">
            Status: <span style={{ color: "#00ff00" }}>Connected</span>
            <br />
            Bank Account ending in: <span style={{ color: "#00ff00" }}>8948</span>
          </div>
        </div>

        {/* Total Balance */}
        <div className="pmo-total-balance">
          <div className="pmo-label">TOTAL BALANCE</div>
          <div className="pmo-amount">$56.95</div>
        </div>

        {/* Footer Note */}
        <div className="pmo-footer-note">
          PAYOUTS ARE DONE MANUALLY BY VRUMIES AFTER VERIFICATION OF ORDER COMPLETION
        </div>
      </div>
    </div>
  );
}
