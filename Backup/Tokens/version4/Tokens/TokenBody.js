import React from 'react';
import './TokenBody.css';

const TokenBody = () => {
  return (
    <div className="token-body">
      <div className="order-section">
        <h3 className="order-header">Basic Order</h3>
        <div className="quantity-selector">
          <label>Select Quantity</label>
          <div className="quantity-controls">
            <button className="quantity-button">-</button>
            <span className="quantity-display">40</span>
            <button className="quantity-button">+</button>
            <span className="quantity-display">VBT</span>
          </div>
        </div>
        <div className="total-section">
          <span>Total</span>
          <span>$10</span>
        </div>
      </div>

      <div className="card-info-section">
        <h3 className="card-info-header">Card Info</h3>
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input type="text" value="John" readOnly />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" value="Smith" readOnly />
          </div>
        </div>
        <div className="form-group">
          <label>Card Number</label>
          <input type="text" value="4756 5648 8496 9018" readOnly />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Expiration Date</label>
            <input type="text" value="07 / 22" readOnly />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input type="text" value="319" readOnly />
          </div>
          <div className="form-group">
            <label>Zip Code</label>
            <input type="text" value="78505" readOnly />
          </div>
        </div>
      </div>

      <div className="bank-icon">🏦</div>
      <div className="action-buttons">
        <button className="back-button">Back</button>
        <button className="pay-button">Pay</button>
      </div>
    </div>
  );
};

export default TokenBody;
