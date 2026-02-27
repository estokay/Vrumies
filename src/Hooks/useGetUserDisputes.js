import { useEffect, useState } from "react";
import { db } from "../Components/firebase"; // adjust path if needed
import { doc, getDoc } from "firebase/firestore";

/**
 * Hook: useGetUserDisputes
 * Returns the number of disputes a user has
 */
function useGetUserDisputes(userId) {
  // Matching your template: initialized at 0
  const [disputes, setDisputes] = useState(0);

  useEffect(() => {
    const fetchDisputes = async () => {
      if (!userId) {
        setDisputes(0);
        return;
      }

      try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setDisputes(0);
          return;
        }

        // Using the nullish coalescing operator (??) just like your token hook
        setDisputes(userSnap.data().disputes ?? 0);
      } catch (err) {
        console.error("Error fetching user disputes:", err);
        setDisputes(0);
      }
    };

    fetchDisputes();
  }, [userId]);

  return disputes;
}

export default useGetUserDisputes;