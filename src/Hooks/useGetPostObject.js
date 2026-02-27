import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Components/firebase"; // adjust path if needed

export default function useGetPostObject(postId) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) {
      setPost(null);
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const postRef = doc(db, "Posts", postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          setPost({ id: postSnap.id, ...postSnap.data() });
        } else {
          setPost(null);
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return { post, loading, error };
}