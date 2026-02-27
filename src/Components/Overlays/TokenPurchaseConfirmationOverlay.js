import React from "react";
import "./TokenPurchaseConfirmationOverlay.css";

const TokenPurchaseConfirmationOverlay = ({ amount, onClose }) => {
  return (
    <div
      className="tpc-overlay-backdrop"
      onClick={onClose} // click on backdrop closes overlay
    >
      <div
        className="tpc-overlay-container"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside container
      >
        <div className="tpc-overlay-content">
          <h2 className="tpc-overlay-title">
            You have purchased {amount} Vrumies Bump Tokens
          </h2>
          <p className="tpc-overlay-description">
            Use Vrumies Bump Tokens to increase the visibility of your posts.
          </p>

          <button className="tpc-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPurchaseConfirmationOverlay;