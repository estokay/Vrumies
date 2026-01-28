import { useEffect, useState } from "react";
import { db } from "../firebase"; // adjust path if needed
import { doc, getDoc } from "firebase/firestore";

/**
 * Hook: useGetPostTitle
 * Returns the title of a post for a given postId
 */
function useGetPostTitle({ postId }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchTitle = async () => {
      if (!postId) return;

      try {
        const postRef = doc(db, "Posts", postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
          setTitle("");
          return;
        }

        setTitle(postSnap.data().title || "");
      } catch (err) {
        console.error("Error fetching post title:", err);
        setTitle("");
      }
    };

    fetchTitle();
  }, [postId]);

  return title; // returning the string directly
}

export default useGetPostTitle;