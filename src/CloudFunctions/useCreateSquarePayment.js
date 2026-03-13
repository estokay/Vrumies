import { useState } from "react";
import { useAuth } from "../AuthContext";
import { SQUARE_APPLICATION_ID as SQUARE_APP_ID} from '../Components/config';
import { SQUARE_LOCATION_ID as SQUARE_LOC_ID} from '../Components/config';

export default function useCreateSquarePayment() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SQUARE_APPLICATION_ID = SQUARE_APP_ID;
  const SQUARE_LOCATION_ID = SQUARE_LOC_ID;

  const processPayment = async ({ amount, nonce }) => {
    if (!currentUser) throw new Error("User must be logged in.");
    if (!amount || !nonce) throw new Error("Missing amount or card nonce.");

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

  return { processPayment, loading, error, SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID };
}