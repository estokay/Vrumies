import React from "react";
import { useNavigate } from "react-router-dom";
import "./PurchaseCompleteOverlay.css";

const PurchaseCompleteOverlay = ({ onClose }) => {
  const navigate = useNavigate();

  const handleGoToOrders = () => {
    navigate("/orders");
    onClose(); // optional: close overlay after navigation
  };

  return (
    <div
      className="purchaseOverlayBackdropZ"
      onClick={onClose}
    >
      <div
        className="purchaseOverlayModalZ"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="purchaseOverlayContentZ">
          <h2 className="purchaseOverlayTitleZ">
            Purchase Complete
          </h2>

          <p className="purchaseOverlayMessageZ">
            View your new order in the order page.
          </p>

          <div className="purchaseOverlayButtonRowZ">
            <button
              className="purchaseOverlayOrdersBtnZ"
              onClick={handleGoToOrders}
            >
              Order Page
            </button>

            <button
              className="purchaseOverlayCloseBtnZ"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCompleteOverlay;