import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Components/firebase";
import { auth } from "../Components/firebase";

export function useGetUserReferralCode() {
  const [referralCode, setReferralCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    setLoading(true); // ← reset loading on auth change
    setError(null);

    try {
      if (!user) {
        setReferralCode(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setReferralCode(null);
      } else {
        const data = userSnap.data();
        setReferralCode(data?.referralCode || null);
      }

    } catch (err) {
      console.error("Error getting referralCode:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);

  return { referralCode, loading, error };
}