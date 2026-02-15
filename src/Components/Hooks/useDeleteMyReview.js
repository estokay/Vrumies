import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

/**
 * Hook: useDeleteMyReview
 * Deletes a review from:
 * Users/{userId}/reviews/{reviewId}
 */
function useDeleteMyReview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteReview = async (userId, reviewId) => {
    if (!userId || !reviewId) return;

    setLoading(true);
    setError(null);

    try {
      await deleteDoc(doc(db, "Users", userId, "Reviews", reviewId));
      toast.success("Review deleted successfully ✅");
    } catch (err) {
      console.error("Error deleting review:", err);
      setError(err);
      toast.error("Error deleting review ❌");
    } finally {
      setLoading(false);
    }
  };

  return { deleteReview, loading, error };
}

export default useDeleteMyReview;