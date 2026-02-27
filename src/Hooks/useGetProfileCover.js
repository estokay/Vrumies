import { useEffect, useState } from "react";
import { db } from "../Components/firebase"; // adjust path if needed
import { doc, getDoc } from "firebase/firestore";

/**
 * Hook: useGetProfileCover
 * Returns the profile cover URL of a given userId
 */
function useGetProfileCover(userId) {
  const [profileCover, setProfileCover] = useState("");

  useEffect(() => {
    const fetchProfileCover = async () => {
      if (!userId) return;

      try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setProfileCover("");
          return;
        }

        setProfileCover(userSnap.data().profilecover || "");
      } catch (err) {
        console.error("Error fetching profile cover:", err);
        setProfileCover("");
      }
    };

    fetchProfileCover();
  }, [userId]);

  return profileCover;
}

export default useGetProfileCover;