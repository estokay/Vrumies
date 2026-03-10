import React, { useState } from 'react';
import './TokenBody.css';
import useCreateTokenPurchase from "../../CloudFunctions/useCreateTokenPurchase";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import TokenPurchaseConfirmationOverlay from "../../Components/Overlays/TokenPurchaseConfirmationOverlay";
import useCreditTokens from '../../CloudFunctions/useCreditTokens';

const TokenBody = () => {
  const [quantity, setQuantity] = useState(0); // Start at 0
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => setQuantity(quantity > 0 ? quantity - 1 : 0);
  const { createTokenPurchase, loading, error } = useCreateTokenPurchase();
  const { creditTokens, loading: creditLoading, error: creditError } = useCreditTokens();

  const total = (quantity * 0.25).toFixed(2);
  const stripe = useStripe();
  const elements = useElements();
  

  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchasedAmount, setPurchasedAmount] = useState(0);

  const payLoading = loading || creditLoading;

  const cardStyle = {
    style: {
      base: {
        color: "#fff",
        fontSize: "16px",
        fontFamily: "Poppins, sans-serif",
        "::placeholder": {
          color: "#888",
        },
        iconColor: "#00FF00", // green icons for card brand
      },
      invalid: {
        color: "#FF4D4D", // red for invalid
        iconColor: "#FF4D4D",
      },
    },
  };

  const handlePay = async () => {
    if (!stripe || !elements) return;
    if (quantity <= 0) return;

    try {
      // Step 1: Create PaymentIntent
      const data = await createTokenPurchase(quantity);
      if (!data) throw new Error("Failed to create PaymentIntent");

      const { clientSecret, paymentIntentId } = data;

      // Step 2: Confirm Card Payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: { name: `${firstName} ${lastName}`.trim() },
        },
      });

      if (error) throw new Error(error.message);

      // Step 3: Credit tokens safely on server
      const creditResult = await creditTokens(paymentIntent.id);
      if (!creditResult || !creditResult.success) {
        throw new Error("Payment succeeded but failed to credit tokens.");
      }

      setPurchasedAmount(quantity);
      setPurchaseSuccess(true);
      setQuantity(0);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Payment failed");
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
            <label>Cardholder Name</label>
              <div className="form-row-horizontal">
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => setFirstName(firstName.trim())}
                />
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => setLastName(lastName.trim())}
                />
            </div>
          </div>

          <div className="form-group">
            <label>Card Number</label>
            <CardNumberElement options={{ ...cardStyle, showIcon: true, placeholder: "Card number" }} />
          </div>

          <div className="form-row-horizontal">
            <div className="form-group">
              <label>Expiry</label>
              <CardExpiryElement options={cardStyle} />
            </div>
            <div className="form-group">
              <label>CVC</label>
              <CardCvcElement options={cardStyle} />
            </div>
          </div>
        </div>
      </div>

      <div className="bank-icon">🏦</div>
      <div className="action-buttons">
        
        <button className="pay-button" onClick={handlePay} disabled={payLoading}>
          {payLoading ? "Processing..." : purchaseSuccess ? "Purchase Again" : "Pay"}
        </button>
      </div>
      {purchaseSuccess && (
        <TokenPurchaseConfirmationOverlay
          amount={purchasedAmount}
          onClose={() => {
            setPurchaseSuccess(false);
            setPurchasedAmount(0);
          }}
        />
      )}
    </div>
  );
};

export default TokenBody;
