import { useState, useCallback } from "react";
import { db } from "../firebase"; // adjust path
import { doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../AuthContext"; // adjust path

/**
 * Hook to unblock a user
 * @returns {unblockUser, loading, error}
 */
export default function useUnblockUser() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Removes a user from the current user's blockedUsers subcollection
   * @param {string} userId - ID of the user to unblock
   */
  const unblockUser = useCallback(
    async (userId) => {
      if (!currentUser) {
        throw new Error("You must be logged in to unblock a user.");
      }
      if (!userId) {
        throw new Error("userId is required to unblock.");
      }

      setLoading(true);
      setError(null);

      try {
        // Reference: Users/{currentUserId}/blockedUsers/{userId}
        const blockedUserRef = doc(
          db,
          "Users",
          currentUser.uid,
          "blockedUsers",
          userId
        );

        await deleteDoc(blockedUserRef);
      } catch (err) {
        console.error("Failed to unblock user:", err);
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  return { unblockUser, loading, error };
}