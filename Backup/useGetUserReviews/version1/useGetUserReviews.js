import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";

export default function useGetUserReviews(userId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, "Users", userId, "Reviews");
        const q = query(reviewsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const reviewsData = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();

            // Get reviewer info
            const reviewerDoc = await getDoc(doc(db, "Users", data.buyerId));
            const reviewerData = reviewerDoc.exists() ? reviewerDoc.data() : {};
            const userName = reviewerData.username || "Unknown User";
            const userPhoto = reviewerData.profilepic || "https://i.pravatar.cc/150";

            // Convert Firestore timestamp
            const createdAt = data.createdAt?.toDate
              ? data.createdAt.toDate()
              : new Date();
            const date = createdAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

            return {
              id: docSnap.id,
              userName,
              userPhoto,
              rating: data.rating,
              date,
              text: data.comment,
            };
          })
        );

        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  return { reviews, loading };
}
