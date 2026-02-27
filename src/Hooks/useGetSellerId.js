import { useState, useEffect } from "react";
import { db } from "../Components/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function useGetSellerId(postId) {
  const [sellerId, setSellerId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const fetchSellerId = async () => {
      setLoading(true);

      try {
        const postRef = doc(db, "Posts", postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const data = postSnap.data();
          setSellerId(data.userId || null);
        } else {
          setSellerId(null);
        }
      } catch (error) {
        console.error("Error fetching sellerId:", error);
        setSellerId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerId();
  }, [postId]);

  return { sellerId, loading };
}