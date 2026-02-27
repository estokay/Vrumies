import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

export default function useSpendUserTokens() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callable = httpsCallable(functions, "spendUserTokens");

  const spendUserTokens = async (amount) => {
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Amount must be a positive number");
    }

    try {
      setLoading(true);
      setError(null);

      const result = await callable({ amount }); // amount is positive
      return result.data; // will include success and newTotal
    } catch (err) {
      console.error("Token spend failed:", err);
      setError(err?.message || JSON.stringify(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { spendUserTokens, loading, error };
}