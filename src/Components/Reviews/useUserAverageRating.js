import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * Hook: useUserAverageRating
 * Returns the average rating as a number with 1 decimal place
 */
function useUserAverageRating(userId) {
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const calculateAverage = async () => {
      if (!userId) return;

      try {
        const reviewsRef = collection(db, "Users", userId, "Reviews");
        const snapshot = await getDocs(reviewsRef);

        if (snapshot.empty) {
          setAverageRating(0);
          return;
        }

        let total = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          total += Number(data.rating) || 0;
        });

        const average = total / snapshot.size;

        // Round to 1 decimal place
        const roundedAverage = Math.round(average * 10) / 10;

        setAverageRating(roundedAverage);
      } catch (error) {
        console.error("Error calculating average rating:", error);
      }
    };

    calculateAverage();
  }, [userId]);

  return averageRating;
}

export default useUserAverageRating;