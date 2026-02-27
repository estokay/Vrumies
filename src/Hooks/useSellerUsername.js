import { useEffect, useState } from "react";
import { db } from "../Components/firebase"; // adjust path if needed
import { doc, getDoc } from "firebase/firestore";

/**
 * Hook: useSellerUsername
 * Returns the username of the seller for a given postId
 */
function useSellerUsername(postId) {
  const [username, setUsername] = useState("Loading...");

  useEffect(() => {
    const fetchUsername = async () => {
      if (!postId) return;

      try {
        // 1. Get the post
        const postRef = doc(db, "Posts", postId);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) {
          setUsername("Post not found");
          return;
        }
        const postData = postSnap.data();

        // 2. Get the seller/user
        const userRef = doc(db, "Users", postData.userId);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          setUsername("Unknown");
          return;
        }

        setUsername(userSnap.data().username || "Unknown");
      } catch (err) {
        console.error("Error fetching seller username:", err);
        setUsername("Error fetching username");
      }
    };

    fetchUsername();
  }, [postId]);

  return username;
}

export default useSellerUsername;
