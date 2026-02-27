import { useState, useEffect } from "react";
import { db } from "../Components/firebase";
import { collection, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";

export default function useGetUserReviews(userId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const reviewsRef = collection(db, "Users", userId, "Reviews");
    const q = query(reviewsRef, orderBy("createdAt", "desc"));

    // Real-time listener
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const reviewsData = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();

            // Get reviewer info
            const reviewerDoc = await getDoc(doc(db, "Users", data.buyerId));
            const reviewerData = reviewerDoc.exists() ? reviewerDoc.data() : {};
            const userName = reviewerData.username || "Unknown User";
            const userPhoto = reviewerData.profilepic || "https://i.pravatar.cc/150";

            // Convert Firestore timestamp
            const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
            const date = createdAt.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            });

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
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [userId]);

  return { reviews, loading };
}