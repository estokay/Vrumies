import { useEffect, useState } from "react";
import { db } from "../firebase"; // adjust path if needed
import { doc, getDoc } from "firebase/firestore";

/**
 * Hook: useUserFollowing
 * Returns the number of users that a user is following
 */
function useUserFollowing(userId) {
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const fetchFollowingCount = async () => {
      if (!userId) return;

      try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setFollowingCount(0);
          return;
        }

        const following = userSnap.data().following;
        setFollowingCount(Array.isArray(following) ? following.length : 0);
      } catch (err) {
        console.error("Error fetching following:", err);
        setFollowingCount(0);
      }
    };

    fetchFollowingCount();
  }, [userId]);

  return followingCount;
}

export default useUserFollowing;
