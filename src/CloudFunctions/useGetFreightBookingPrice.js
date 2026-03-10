import { useState, useEffect, useCallback } from "react";

/**
 * Hook to get freight booking price from your cloud function.
 * @returns {Object} { price, distance, loading, error, fetchPrice }
 */
export default function useGetFreightBookingPrice() {
  const [price, setPrice] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Call the cloud function with pickup, dropoff, and rpm
   */
  const fetchPrice = useCallback(async ({ pickupAddress, dropoffAddress, rpm }) => {
    if (!pickupAddress || !dropoffAddress || !rpm) {
      setError("Missing required parameters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Replace with your deployed cloud function URL
      const url = new URL("https://getfreightbookingprice-k3qu3645ya-uc.a.run.app");
      url.searchParams.append("pickupAddress", pickupAddress);
      url.searchParams.append("dropoffAddress", dropoffAddress);
      url.searchParams.append("rpm", rpm);

      const res = await fetch(url.toString());
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error fetching price");
      }

      setPrice(data.price);
      setDistance(data.distanceMiles);
    } catch (err) {
      setError(err.message);
      setPrice(null);
      setDistance(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { price, distance, loading, error, fetchPrice };
}