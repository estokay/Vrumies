import { useState } from "react";
import { useAuth } from "../AuthContext";

export default function useCreatePaymentIntent() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPaymentIntent = async (amount, currency = "usd") => {
    if (!currentUser) throw new Error("User must be logged in.");

    setLoading(true);
    setError(null);

    try {
      const token = await currentUser.getIdToken();

      const response = await fetch(
        "https://createpaymentintent-k3qu3645ya-uc.a.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // include Firebase auth
          },
          body: JSON.stringify({ amount, currency }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to create PaymentIntent");

      return data.clientSecret; // Use this with stripe.confirmCardPayment
    } catch (err) {
      console.error(err);
      setError(err?.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPaymentIntent, loading, error };
}