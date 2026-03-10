import { useEffect, useState } from "react";
import { db, auth } from "../Components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const useCheckForAffiliateLink = (sellerId) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [affiliateDocId, setAffiliateDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user ? user.uid : null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkForAffiliateLink = async () => {
      try {
        const currentUrl = window.location.href;

        const affiliateRef = collection(db, "AffiliateLinks");
        const q = query(
          affiliateRef,
          where("affiliateLink", "==", currentUrl),
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = doc.data();

          // ✅ Prevent self referral here (NOT in Firestore query)
          if (
            data.userId !== sellerId &&
            data.userId !== currentUserId
          ) {
            setAffiliateDocId(doc.id);
          }
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId !== undefined) {
      checkForAffiliateLink();
    }
  }, [sellerId, currentUserId]);

  return { affiliateDocId, loading, error };
};