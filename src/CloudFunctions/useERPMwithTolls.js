import { useEffect, useState } from "react";

const CLOUD_FUNCTION_URL =
  "https://us-central1-vrumies-github.cloudfunctions.net/getDistance";

export default function useERPMwithTolls(
  pickupAddress,
  dropoffAddress,
  payout
) {
  const [distance, setDistance] = useState(null); // miles
  const [eRPM, setERPM] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pickupAddress || !dropoffAddress || !payout) {
      setDistance(null);
      setERPM(null);
      return;
    }

    let isCancelled = false;

    const fetchDistance = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${CLOUD_FUNCTION_URL}?pickupAddress=${encodeURIComponent(
          pickupAddress
        )}&dropoffAddress=${encodeURIComponent(dropoffAddress)}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch distance from Cloud Function");

        const data = await res.json();

        const element = data?.rows?.[0]?.elements?.[0];

        if (!element || element.status !== "OK") {
          throw new Error("Unable to calculate distance");
        }

        const miles = element.distance.value / 1609.34;

        if (!isCancelled) {
          setDistance(miles);

          const calculatedERPM = payout / miles;
          setERPM(Number(calculatedERPM.toFixed(2)));
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err);
          setDistance(null);
          setERPM(null);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchDistance();

    return () => {
      isCancelled = true;
    };
  }, [pickupAddress, dropoffAddress, payout]);

  return { eRPM, distance, loading, error };
}