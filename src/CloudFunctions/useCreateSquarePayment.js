import { useState } from "react";
import { useAuth } from "../AuthContext";
import usePaymentModes from "../Hooks/usePaymentModes";
import { SQUARE_APP_IDS, SQUARE_LOC_IDS } from "../Components/config";

export default function useCreateSquarePayment() {
  const { currentUser } = useAuth();
  const { squareMode, loading: modeLoading, error: modeError } = usePaymentModes();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SQUARE_APPLICATION_ID = SQUARE_APP_IDS[squareMode];
  const SQUARE_LOCATION_ID = SQUARE_LOC_IDS[squareMode];

  const processPayment = async ({ amount, nonce }) => {
    if (modeLoading) {
      throw new Error("Square configuration still loading.");
    }
    if (!currentUser) throw new Error("User must be logged in.");
    if (!amount || !nonce) throw new Error("Missing amount or card nonce.");
    if (!squareMode) throw new Error("Square mode not loaded.");
    if (!SQUARE_APPLICATION_ID || !SQUARE_LOCATION_ID) {
      throw new Error("Square configuration not ready.");
    }
    

    setLoading(true);
    setError(null);

    try {
      const token = await currentUser.getIdToken();

      const idempotencyKey = window.crypto.randomUUID();

      const response = await fetch("https://createsquarepayment-k3qu3645ya-uc.a.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, nonce, idempotencyKey }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Square backend error:", data);
        throw new Error(data.error || "Payment failed");
      }

      return data.payment; // contains Square payment info
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { processPayment, loading, error: error || modeError, SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID, modeLoading };
}