import { useState, useEffect } from "react";
import useGetUserStripeAccount from "./useGetUserStripeAccount";

export default function useGetStripeBalances(userId) {
  const { stripeAccountId } = useGetUserStripeAccount(userId);

  const [available, setAvailable] = useState(0);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!stripeAccountId) {
      setAvailable(0);
      setPending(0);
      setLoading(false);
      return;
    }

    const fetchBalance = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/getSellerBalance?stripeAccountId=${stripeAccountId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch Stripe balance");
        }

        const balance = await res.json();

        const availableAmount =
          (balance.available?.[0]?.amount || 0) / 100;

        const pendingAmount =
          (balance.pending?.[0]?.amount || 0) / 100;

        setAvailable(Number(availableAmount.toFixed(2)));
        setPending(Number(pendingAmount.toFixed(2)));
      } catch (err) {
        console.error(err);
        setError(err);
        setAvailable(0);
        setPending(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [stripeAccountId]);

  return {
    available,
    pending,
    loading,
    error,
    stripeAccountId,
  };
}