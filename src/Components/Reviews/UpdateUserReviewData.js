import { useEffect } from "react";
import { db } from "../firebase"; // adjust path if needed
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

function UpdateUserReviewData({ userId }) {
  useEffect(() => {
    const updateReviewData = async () => {
      if (!userId) return;

      try {
        const reviewsRef = collection(db, "Users", userId, "Reviews");
        const snapshot = await getDocs(reviewsRef);

        let totalReviews = snapshot.size;
        let totalRating = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          totalRating += Number(data.rating) || 0;
        });

        const avgReviews =
          totalReviews > 0 ? totalRating / totalReviews : 0;

        await setDoc(
          doc(db, "Users", userId),
          {
            avgReviews,
            totalReviews,
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error updating user review data:", error);
      }
    };

    updateReviewData();
  }, [userId]);

  return null; // logic-only component
}

export default UpdateUserReviewData;
