import { useEffect, useState } from "react";
import { db } from "../firebase"; // adjust path if needed
import { collection, getDocs } from "firebase/firestore";

/**
 * Hook: useUserTotalRatings
 * Returns the total number of reviews for a user as a number
 */
function useUserTotalRatings(userId) {
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    const countReviews = async () => {
      if (!userId) return;

      try {
        const reviewsRef = collection(db, "Users", userId, "Reviews");
        const snapshot = await getDocs(reviewsRef);

        setTotalRatings(snapshot.size); // number of review documents
      } catch (error) {
        console.error("Error counting reviews:", error);
      }
    };

    countReviews();
  }, [userId]);

  return totalRatings;
}

export default useUserTotalRatings;
