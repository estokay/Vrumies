import { useEffect, useState } from "react";
import { db } from "../firebase"; // adjust path if needed
import { doc, getDoc } from "firebase/firestore";

/**
 * Hook: useUserTokens
 * Returns the number of tokens a user has
 */
function useUserTokens(userId) {
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!userId) return;

      try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setTokens(0);
          return;
        }

        setTokens(userSnap.data().tokens ?? 0);
      } catch (err) {
        console.error("Error fetching user tokens:", err);
        setTokens(0);
      }
    };

    fetchTokens();
  }, [userId]);

  return tokens;
}

export default useUserTokens;
