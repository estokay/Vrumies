import React, { useEffect, useState } from "react";
import { db } from "../../Components/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./PaymentMode.css";

function PaymentMode() {
  const [stripeMode, setStripeMode] = useState("TEST");
  const [squareMode, setSquareMode] = useState("TEST");
  const [loading, setLoading] = useState(true);

  const configRef = doc(db, "SystemConfig", "PaymentProcessors");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const snap = await getDoc(configRef);
        if (snap.exists()) {
          const data = snap.data();
          setStripeMode(data.Stripe || "TEST");
          setSquareMode(data.Square || "TEST");
        }
      } catch (err) {
        console.error("Error fetching config:", err);
      }
      setLoading(false);
    };

    fetchConfig();
  }, []);

  const updateMode = async (type, value) => {
    try {
      await updateDoc(configRef, {
        [type]: value
      });

      if (type === "Stripe") setStripeMode(value);
      if (type === "Square") setSquareMode(value);
    } catch (err) {
      console.error("Error updating mode:", err);
    }
  };

  if (loading) return <p className="pm-loading">Loading...</p>;

  return (
    <div className="pm-container">
      <h1>Payment Processor Modes</h1>

      {/* Square Section */}
      <div className="pm-section">
        <h2>Orders (Square)</h2>
        <p>Current Mode: <strong>{squareMode}</strong></p>

        <div className="pm-toggle">
          <button
            className={squareMode === "LIVE" ? "active" : ""}
            onClick={() => updateMode("Square", "LIVE")}
          >
            LIVE
          </button>
          <button
            className={squareMode === "TEST" ? "active" : ""}
            onClick={() => updateMode("Square", "TEST")}
          >
            TEST
          </button>
        </div>
      </div>

      {/* Stripe Section */}
      <div className="pm-section">
        <h2>Token Purchases (Stripe)</h2>
        <p>Current Mode: <strong>{stripeMode}</strong></p>

        <div className="pm-toggle">
          <button
            className={stripeMode === "LIVE" ? "active" : ""}
            onClick={() => updateMode("Stripe", "LIVE")}
          >
            LIVE
          </button>
          <button
            className={stripeMode === "TEST" ? "active" : ""}
            onClick={() => updateMode("Stripe", "TEST")}
          >
            TEST
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentMode;