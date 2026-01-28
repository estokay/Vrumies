import { useEffect, useState } from "react";
import { db } from "../firebase"; // adjust path if needed
import { doc, getDoc } from "firebase/firestore";

/**
 * Hook: useGetUsername
 * Returns the username of a given userId
 */
function useGetUsername(userId) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      if (!userId) return;

      try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setUsername("");
          return;
        }

        setUsername(userSnap.data().username || "");
      } catch (err) {
        console.error("Error fetching username:", err);
        setUsername("");
      }
    };

    fetchUsername();
  }, [userId]);

  return username;
}

export default useGetUsername;