import { useState } from "react";

export function useCreatePaymentIntent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = async (amount: number, sellerId: string, metadata = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/createPaymentIntent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, sellerId, metadata }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to create PaymentIntent");

      return data.clientSecret; // you use this with stripe.confirmCardPayment
    } catch (err: any) {
      setError(err.message);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPaymentIntent, loading, error };
}