import { useState, useEffect } from "react";
import { db } from "../Components/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

export default function useCheckIfBooked(postId) {
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfBooked = async () => {
      if (!postId) {
        setAlreadyBooked(false);
        setLoading(false);
        return;
      }

      try {
        const ordersRef = collection(db, "Orders");

        const q = query(
          ordersRef,
          where("postData.postId", "==", postId),
          limit(1) // performance optimization
        );

        const snapshot = await getDocs(q);

        setAlreadyBooked(!snapshot.empty);
      } catch (err) {
        console.error("Error checking booked status:", err);
        setAlreadyBooked(false);
      } finally {
        setLoading(false);
      }
    };

    checkIfBooked();
  }, [postId]);

  return { alreadyBooked, loading };
}