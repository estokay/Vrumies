import { useEffect, useState } from "react";
import { db } from "../firebase"; // adjust path if needed
import { doc, getDoc } from "firebase/firestore";

/**
 * Hook: useUserFollowers
 * Returns the number of followers a user has
 */
function useUserFollowers(userId) {
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const fetchFollowersCount = async () => {
      if (!userId) return;

      try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setFollowersCount(0);
          return;
        }

        const followers = userSnap.data().followers;
        setFollowersCount(Array.isArray(followers) ? followers.length : 0);
      } catch (err) {
        console.error("Error fetching followers:", err);
        setFollowersCount(0);
      }
    };

    fetchFollowersCount();
  }, [userId]);

  return followersCount;
}

export default useUserFollowers;
