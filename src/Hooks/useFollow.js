import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../Components/firebase";

export const useFollow = (currentUserId, targetUserId) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId || !targetUserId) return;

    const checkFollowing = async () => {
      setLoading(true);
      try {
        const targetUserRef = doc(db, "Users", targetUserId);
        const currentUserRef = doc(db, "Users", currentUserId);

        const [targetSnap, currentSnap] = await Promise.all([
          getDoc(targetUserRef),
          getDoc(currentUserRef),
        ]);

        if (targetSnap.exists() && currentSnap.exists()) {
          const targetFollowers = targetSnap.data().followers || [];
          const currentFollowing = currentSnap.data().following || [];

          setIsFollowing(
            targetFollowers.includes(currentUserId) &&
              currentFollowing.includes(targetUserId)
          );
        }
      } catch (err) {
        console.error("Error checking follow status:", err);
      } finally {
        setLoading(false);
      }
    };

    checkFollowing();
  }, [currentUserId, targetUserId]);

  const toggleFollow = async () => {
    if (!currentUserId || !targetUserId) return;

    const targetUserRef = doc(db, "Users", targetUserId);
    const currentUserRef = doc(db, "Users", currentUserId);

    try {
      if (isFollowing) {
        // Unfollow
        await Promise.all([
          updateDoc(targetUserRef, { followers: arrayRemove(currentUserId) }),
          updateDoc(currentUserRef, { following: arrayRemove(targetUserId) }),
        ]);
        setIsFollowing(false);
      } else {
        // Follow
        await Promise.all([
          updateDoc(targetUserRef, { followers: arrayUnion(currentUserId) }),
          updateDoc(currentUserRef, { following: arrayUnion(targetUserId) }),
        ]);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  return { isFollowing, toggleFollow, loading };
};