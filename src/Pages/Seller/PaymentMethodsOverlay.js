import React from "react";
import "./PaymentMethodsOverlay.css";

export default function PaymentMethodsOverlay({ onClose }) {
  return (
    <div className="overlay">
      <div className="overlay-content">
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Cash App */}
        <div className="payment-method">
          <img
            src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1755541634/CashApp-Icon_kykgyd.png"
            alt="Cash App"
          />
          <input type="text" placeholder="TYPE YOUR CASH APP USERNAME HERE..." />
          <button className="cancel-btn">Cancel</button>
          <button className="save-btn">Save</button>
        </div>

        {/* Venmo */}
        <div className="payment-method">
          <img
            src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1755541634/Venmo-Icon_wbjipo.png"
            alt="Venmo"
          />
          <input type="text" placeholder="TYPE YOUR VENMO USERNAME HERE..." />
          <button className="cancel-btn">Cancel</button>
          <button className="save-btn">Save</button>
        </div>

        {/* PayPal */}
        <div className="payment-method">
          <img
            src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1755541634/Paypal-Icon_isktt9.png"
            alt="PayPal"
          />
          <input type="text" placeholder="TYPE YOUR PAYPAL USERNAME HERE..." />
          <button className="cancel-btn">Cancel</button>
          <button className="save-btn">Save</button>
        </div>

        {/* Bank Account (Stripe) */}
        <div className="bank-method">
          <img
            src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1755541634/Stripe-Icon_f5i6vd.png"
            alt="Stripe"
          />
          <button className="connect-btn">Connect</button>
          <div className="bank-status">
            Status: <span style={{ color: "#00ff00" }}>Connected</span>
            <br />
            Bank Account ending in: <span style={{ color: "#00ff00" }}>8948</span>
          </div>
        </div>

        {/* Total Balance */}
        <div className="total-balance">
          <div className="label">TOTAL BALANCE</div>
          <div className="amount">$56.95</div>
        </div>

        {/* Footer Note */}
        <div className="footer-note">
          PAYOUTS ARE DONE MANUALLY BY VRUMIES AFTER VERIFICATION OF ORDER COMPLETION
        </div>
      </div>
    </div>
  );
}
