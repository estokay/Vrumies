import React from "react";
import "./CartSidePanel.css";

export default function CartSidePanel() {
  const subtotal = 398.97;
  const taxes = 59.85;
  const total = subtotal + taxes;

  return (
    <div className="cart-side-panel">
      <div className="row">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="row">
        <span>Taxes & Fees:</span>
        <span>${taxes.toFixed(2)}</span>
      </div>
      <hr />
      <div className="row total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <button className="checkout-btn">Checkout</button>
    </div>
  );
}
