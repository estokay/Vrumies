import React, { useState, useEffect, useRef } from "react";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { auth, db } from "../../Components/firebase";
import { doc, onSnapshot, collection, query, orderBy } from "firebase/firestore";
import useCreateTokenPurchase from "../../CloudFunctions/useCreateTokenPurchase";
import useCreditTokens from "../../CloudFunctions/useCreditTokens";
import "./TokenPageMobile.css";

import { STRIPE_API_KEY } from '../../Components/config';
const stripePromise = loadStripe(STRIPE_API_KEY);

const TokenPageMobile = () => {
  return (
    <div className="mp-container">
      <TokenHeaderMobile />
      <div className="mp-main">
        <TokenSidePanelMobile />
        <Elements stripe={stripePromise}>
          <TokenBodyMobile />
        </Elements>
        <TokenHistoryMobile />
      </div>
    </div>
  );
};

/* ---------------- HEADER ---------------- */
const TokenHeaderMobile = () => (
  <div className="mp-header">
    My Tokens
  </div>
);

/* ---------------- SIDE PANEL ---------------- */
const TokenSidePanelMobile = () => {
  const [tokens, setTokens] = useState(0);
  const [displayTokens, setDisplayTokens] = useState(0);
  const prevTokensRef = useRef(0);

  const animateTokens = (start, end) => {
    const duration = 500;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(start + (end - start) * progress);
      setDisplayTokens(currentValue);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const userDocRef = doc(db, "Users", currentUser.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const newTokens = docSnap.data().tokens ?? 0;
        const startTokens = prevTokensRef.current === 0 ? newTokens : prevTokensRef.current;
        animateTokens(startTokens, newTokens);
        prevTokensRef.current = newTokens;
        setTokens(newTokens);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="mp-side-panel">
      <div className="mp-logo">
        <img src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1756806527/Tokens-Icon_bhee9s.png" alt="Tokens Icon" />
      </div>
      <h2 className="mp-side-title">Vrumies Bump Tokens</h2>
      <p className="mp-side-text">You have:</p>
      <p className="mp-token-count">{displayTokens} VBT</p>
      <span className="mp-side-subtext">1 VBT = $0.25</span>
    </div>
  );
};

/* ---------------- BODY ---------------- */
const TokenBodyMobile = () => {
  const [quantity, setQuantity] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchasedAmount, setPurchasedAmount] = useState(0);

  const { createTokenPurchase, loading, error } = useCreateTokenPurchase();
  const { creditTokens, loading: creditLoading, error: creditError } = useCreditTokens();

  const stripe = useStripe();
  const elements = useElements();

  const payLoading = loading || creditLoading;
  const total = (quantity * 0.25).toFixed(2);

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => setQuantity(quantity > 0 ? quantity - 1 : 0);

  const cardStyle = {
    style: {
      base: {
        color: "#fff",
        fontSize: "16px",
        fontFamily: "Poppins, sans-serif",
        "::placeholder": { color: "#888" },
        iconColor: "#00FF00",
      },
      invalid: {
        color: "#FF4D4D",
        iconColor: "#FF4D4D",
      },
    },
  };

  const handlePay = async () => {
    if (!stripe || !elements || quantity <= 0) return;

    try {
      const data = await createTokenPurchase(quantity);
      if (!data) throw new Error("Failed to create PaymentIntent");
      const { clientSecret } = data;

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: { name: `${firstName} ${lastName}`.trim() },
        },
      });

      if (error) throw new Error(error.message);

      const creditResult = await creditTokens(paymentIntent.id);
      if (!creditResult.success) throw new Error("Payment succeeded but failed to credit tokens.");

      setPurchasedAmount(quantity);
      setPurchaseSuccess(true);
      setQuantity(0);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Payment failed");
    }
  };

  return (
    <div className="mp-body">
      <div className="mp-order-section">
        <h3 className="mp-order-title">Basic Order</h3>
        <div className="mp-quantity-selector">
          <button className="mp-qty-btn" onClick={handleDecrement}>-</button>
          <span className="mp-qty-display">{quantity}</span>
          <button className="mp-qty-btn" onClick={handleIncrement}>+</button>
          <span className="mp-qty-label">VBT</span>
        </div>
        <div className="mp-total-section">
          <span>Total:</span>
          <span>${total}</span>
        </div>
      </div>

      <div className="mp-card-section">
        <h3 className="mp-card-title">Card Info</h3>
        <div className="mp-card-names">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            onBlur={() => setFirstName(firstName.trim())}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            onBlur={() => setLastName(lastName.trim())}
          />
        </div>
        <CardNumberElement options={{ ...cardStyle, showIcon: true }} />
        <div className="mp-card-exp-cvc">
          <CardExpiryElement options={cardStyle} />
          <CardCvcElement options={cardStyle} />
        </div>
      </div>

      <button className="mp-pay-btn" onClick={handlePay} disabled={payLoading}>
        {payLoading ? "Processing..." : purchaseSuccess ? "Purchase Again" : "Pay"}
      </button>
    </div>
  );
};

/* ---------------- HISTORY ---------------- */
const TokenHistoryMobile = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) { setLoading(false); return; }

    const historyRef = collection(db, "Users", user.uid, "TokenPurchaseHistory");
    const q = query(historyRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, snapshot => {
      const history = snapshot.docs.map((doc, idx) => {
        const data = doc.data();
        return {
          id: doc.id,
          tokens: data.vbt || 0,
          amount: `$${data.price || 0}`,
          date: data.createdAt ? data.createdAt.toDate().toLocaleDateString() : "No date",
        };
      });
      setPurchaseHistory(history);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="mp-history">
      <h2>Token History</h2>
      {loading && <p>Loading...</p>}
      {!loading && purchaseHistory.length === 0 && <p>No purchases yet.</p>}
      {purchaseHistory.map((item, idx) => (
        <div key={item.id} className="mp-history-item">
          <span>{purchaseHistory.length - idx}. {item.date}</span>
          <span className="mp-history-tokens">{item.tokens} VBT</span>
          <span>{item.amount}</span>
        </div>
      ))}
    </div>
  );
};

export default TokenPageMobile;