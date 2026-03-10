import { useState, useCallback } from "react";
import { getAuth } from "firebase/auth";

/**
 * Custom hook to create a token purchase PaymentIntent.
 * Returns clientSecret and paymentIntentId for two-step payment flow.
 */
export default function useCreateTokenPurchase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTokenPurchase = useCallback(async (quantity) => {
    setLoading(true);
    setError(null);

    try {
      if (!quantity || typeof quantity !== "number" || quantity <= 0) {
        throw new Error("Invalid quantity.");
      }

      const user = getAuth().currentUser;
      if (!user) throw new Error("User is not authenticated.");

      const idToken = await user.getIdToken();

      // Make request to your Cloud Function
      const response = await fetch(
        "https://createtokenpurchase-k3qu3645ya-uc.a.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create PaymentIntent.");
      }

      // Return full data object: { clientSecret, paymentIntentId }
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      console.error("useCreateTokenPurchase error:", message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTokenPurchase, loading, error };
}