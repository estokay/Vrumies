import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./PaymentInformationOverlay.css";

const PaymentInformationOverlay = ({ onClose }) => {
  // Optional: lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="pio-overlay-backdrop" onClick={onClose}>
      <div
        className="pio-overlay-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pio-overlay-content">
          <h2 className="pio-overlay-title">
            Payment Information
          </h2>

          <p className="pio-overlay-description">
            You will be sent an email to the email connected to your Vrumies
            account. Click <strong>“Accept Payment”</strong> and submit the
            deposit information.
          </p>

          <div className="pio-step">
            <h3>Email:</h3>
            <img
              src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1772015157/Email_hfbllq.jpg"
              alt="Email Example"
              className="pio-image"
            />
          </div>

          <div className="pio-step">
            <h3>Choosing Deposit Option:</h3>
            <img
              src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1772015157/Select_Payment_Method_fgp7mu.jpg"
              alt="Select Payment Method"
              className="pio-image"
            />
          </div>

          <div className="pio-step">
            <h3>Submitting Deposit Information:</h3>
            <img
              src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1772015156/Direct_Deposit_Example_ff2thn.jpg"
              alt="Direct Deposit Example"
              className="pio-image"
            />
          </div>

          <button className="pio-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PaymentInformationOverlay;