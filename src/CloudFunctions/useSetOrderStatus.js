import { useCallback, useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../Components/firebase";

export default function useSetOrderStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setOrderStatus = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const functions = getFunctions(app, "us-central1");
      const callable = httpsCallable(functions, "setOrderStatus");

      const result = await callable(data);

      setLoading(false);
      return result.data;
    } catch (err) {
      console.error("Error calling setOrderStatus:", err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  return { setOrderStatus, loading, error };
}