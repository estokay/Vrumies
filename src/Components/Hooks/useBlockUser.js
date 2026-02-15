import { useCallback, useState } from "react";
import { db } from "../firebase"; // adjust path
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * Hook to block a user
 * @returns {blockUser, loading, error}
 */
export function useBlockUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const blockUser = useCallback(async (userId, toBlockUserId, reason = "", from = "") => {
    if (!userId || !toBlockUserId) {
      throw new Error("userId and toBlockUserId are required");
    }

    setLoading(true);
    setError(null);

    try {
      // Users/{userId}/blockedUsers/{toBlockUserId}
      const blockedRef = doc(
        db,
        "Users",
        userId,
        "blockedUsers",
        toBlockUserId
      );

      await setDoc(blockedRef, {
        reason,
        from,
        blockedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to block user:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { blockUser, loading, error };
}
