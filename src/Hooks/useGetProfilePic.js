import { useEffect, useState } from "react";
import { db } from "../Components/firebase"; // adjust path if needed
import { doc, getDoc } from "firebase/firestore";

/**
 * Hook: useGetProfilePic
 * Returns the profile picture URL of a given userId
 */

function useGetProfilePic(userId) {
  const DEFAULT = `${process.env.PUBLIC_URL}/default-profile.png`;

  const [profilePic, setProfilePic] = useState(DEFAULT);

  useEffect(() => {
    let isMounted = true;

    if (!userId) {
      setProfilePic(DEFAULT);
      return;
    }

    // Optional: show default immediately while loading
    setProfilePic(DEFAULT);

    const fetchProfilePic = async () => {
      try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (!isMounted) return;

        if (!userSnap.exists()) {
          setProfilePic(DEFAULT);
          return;
        }

        const url = userSnap.data().profilepic;

        setProfilePic(url || DEFAULT);
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching profile picture:", err);
          setProfilePic(DEFAULT);
        }
      }
    };

    fetchProfilePic();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return profilePic;
}

export default useGetProfilePic;
