import { useState, useEffect } from "react";
import { db } from "../firebase"; // adjust path if needed
import { doc, getDoc } from "firebase/firestore";

/**
 * Hook: useGetOriginalPostData
 * Given a postId, fetches the "originalPost" id from that post,
 * then fetches the original post document and returns it as an object.
 */
export default function useGetOriginalPostObject(postId) {
  const [originalPost, setOriginalPost] = useState(null); // will hold the original post document
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) {
      setOriginalPost(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchOriginalPost = async () => {
      try {
        setLoading(true);

        // Step 1: fetch the post to get originalPost ID
        const postRef = doc(db, "Posts", postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
          if (!cancelled) {
            setOriginalPost(null);
            setLoading(false);
          }
          return;
        }

        const originalPostId = postSnap.data().originalPost;

        if (!originalPostId) {
          if (!cancelled) {
            setOriginalPost(null);
            setLoading(false);
          }
          return;
        }

        // Step 2: fetch the original post
        const originalPostRef = doc(db, "Posts", originalPostId);
        const originalSnap = await getDoc(originalPostRef);

        if (!cancelled) {
          if (originalSnap.exists()) {
            setOriginalPost(originalSnap.data());
          } else {
            setOriginalPost(null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching original post data:", err);
        if (!cancelled) {
          setOriginalPost(null);
          setLoading(false);
        }
      }
    };

    fetchOriginalPost();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  return { originalPost, loading };
}