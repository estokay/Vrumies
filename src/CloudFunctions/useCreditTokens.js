import { useState, useCallback } from "react";
import { getAuth } from "firebase/auth";

/**
 * Custom hook to call the creditTokens Cloud Function.
 * Call this AFTER a successful Stripe payment to safely credit tokens.
 */
export default function useCreditTokens() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const creditTokens = useCallback(async (paymentIntentId) => {
    setLoading(true);
    setError(null);

    try {
      if (!paymentIntentId || typeof paymentIntentId !== "string") {
        throw new Error("Invalid paymentIntentId.");
      }

      const user = getAuth().currentUser;
      if (!user) throw new Error("User is not authenticated.");

      const idToken = await user.getIdToken();

      const response = await fetch(
        "https://credittokens-k3qu3645ya-uc.a.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ paymentIntentId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to credit tokens.");
      }

      // Returns { success: true, tokensAdded }
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      console.error("useCreditTokens error:", message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { creditTokens, loading, error };
}