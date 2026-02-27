import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Components/firebase"; // adjust the path to your firebase config

function useGetUserStripeAccount(userId) {
  const [stripeAccountId, setStripeAccountId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchStripeAccount = async () => {
      setLoading(true);
      try {
        const userDocRef = doc(db, "Users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setStripeAccountId(data?.sellerStripeAccountId || null);
        } else {
          setStripeAccountId(null);
        }
      } catch (err) {
        console.error("Error fetching Stripe account ID:", err);
        setError(err);
        setStripeAccountId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStripeAccount();
  }, [userId]);

  return { stripeAccountId, loading, error };
}

export default useGetUserStripeAccount;