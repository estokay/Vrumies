import { useState, useCallback } from "react";
import { getAuth } from "firebase/auth";

/**
 * Custom hook to call the Firebase HTTPS function to complete a token purchase.
 */
export default function useCreateTokenPurchase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  const createTokenPurchase = useCallback(async (quantity) => {
    setLoading(true);
    setError(null);
    setClientSecret(null);

    try {
      if (!quantity || typeof quantity !== "number" || quantity <= 0) {
        throw new Error("Invalid quantity.");
      }

      const user = getAuth().currentUser;
      if (!user) throw new Error("User is not authenticated.");

      const idToken = await user.getIdToken();

      const response = await fetch(
        "https://us-central1-vrumies-github.cloudfunctions.net/createTokenPurchase",
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
        throw new Error(data?.error || "Failed to complete token purchase.");
      }

      setClientSecret(data.clientSecret);
      return data.clientSecret;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTokenPurchase, loading, error, clientSecret };
}