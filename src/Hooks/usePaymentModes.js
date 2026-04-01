import { useEffect, useState } from "react";
import { db } from "../Components/firebase";
import { doc, onSnapshot } from "firebase/firestore";

function usePaymentModes() {
  const [stripeMode, setStripeMode] = useState(null);
  const [squareMode, setSquareMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = doc(db, "SystemConfig", "PaymentProcessors");

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setError("PaymentProcessors config document does not exist.");
          setLoading(false);
          return;
        }

        const data = snap.data();

        if (!data.Stripe || !data.Square) {
          setError("Missing Stripe or Square field in PaymentProcessors.");
          setLoading(false);
          return;
        }

        setStripeMode(data.Stripe);
        setSquareMode(data.Square);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching payment modes:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    stripeMode,
    squareMode,
    loading,
    error
  };
}

export default usePaymentModes;