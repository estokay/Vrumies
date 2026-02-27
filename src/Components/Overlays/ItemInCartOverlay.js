import React from "react";
import { useNavigate } from "react-router-dom";
import "./ItemInCartOverlay.css";

const ItemInCartOverlay = ({ productName, onClose }) => {
  const navigate = useNavigate();

  const handleGoToCart = () => {
    navigate("/cart");
    onClose(); // optional: closes overlay after navigating
  };

  return (
    <div
      className="cartOverlayBackdropX"
      onClick={onClose}
    >
      <div
        className="cartOverlayBoxX"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cartOverlayInnerX">
          <h2 className="cartOverlayTitleX">
            Item added to cart
          </h2>

          <p className="cartOverlayProductNameX">
            {productName}
          </p>

          <div className="cartOverlayButtonRowX">
            <button
              className="cartOverlayGoToCartBtnX"
              onClick={handleGoToCart}
            >
              Go to Cart
            </button>

            <button
              className="cartOverlayCloseBtnX"
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

export default ItemInCartOverlay;