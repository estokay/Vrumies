import { useEffect, useState } from "react";
import { db } from "../firebase"; // adjust path if needed
import { doc, getDoc } from "firebase/firestore";

/**
 * Hook: useGetProfilePic
 * Returns the profile picture URL of a given userId
 */
function useGetProfilePic(userId) {
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const fetchProfilePic = async () => {
      if (!userId) return;

      try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setProfilePic("");
          return;
        }

        setProfilePic(userSnap.data().profilepic || "");
      } catch (err) {
        console.error("Error fetching profile picture:", err);
        setProfilePic("");
      }
    };

    fetchProfilePic();
  }, [userId]);

  return profilePic;
}

export default useGetProfilePic;
