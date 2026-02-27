import React, { useState } from 'react';
import './TokenBody.css';
import useCompleteTokenPurchase from "../../Components/CloudFunctions/useCompleteTokenPurchase";

const TokenBody = () => {
  const [quantity, setQuantity] = useState(0); // Start at 0
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvv, setCvv] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => setQuantity(quantity > 0 ? quantity - 1 : 0);
  const { completeTokenPurchase, loading } = useCompleteTokenPurchase();

  const total = (quantity * 0.25).toFixed(2);

  const handlePay = async () => {
    if (quantity <= 0) return;

    try {
      // ⚠️ paymentIntentId must come from Stripe confirmation step
      const paymentIntentId = "REPLACE_WITH_REAL_PAYMENT_INTENT_ID";

      await completeTokenPurchase({
        paymentIntentId,
        vbt: quantity,
      });

      alert("✅ Tokens added successfully!");
    } catch (err) {
      alert("❌ Payment failed");
    }
  };

  return (
    <div className="token-body">
      <div className="order-section">
        <h3 className="order-header">Basic Order</h3>
        <div className="quantity-selector">
          <label>Select Quantity</label>
          <div className="quantity-controls">
            <button className="quantity-button" onClick={handleDecrement}>-</button>
            <span className="quantity-display">{quantity}</span>
            <button className="quantity-button" onClick={handleIncrement}>+</button>
            <span className="quantity-display">VBT</span>
          </div>
        </div>
        <div className="total-section">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      <div className="card-info-section">
        <h3 className="card-info-header">Card Info</h3>
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Smith"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            placeholder="4756 5648 8496 9018"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Expiration Date</label>
            <input
              type="text"
              placeholder="07 / 22"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input
              type="text"
              placeholder="319"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              placeholder="78505"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bank-icon">🏦</div>
      <div className="action-buttons">
        <button className="back-button">Back</button>
        <button className="pay-button" onClick={handlePay} disabled={loading}>
          {loading ? "Processing..." : "Pay"}
        </button>
      </div>
    </div>
  );
};

export default TokenBody;
