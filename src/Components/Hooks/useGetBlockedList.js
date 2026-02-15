import { useState, useEffect } from "react";
import { db } from "../firebase"; // adjust path to your firebase config
import { collection, getDocs } from "firebase/firestore";

/**
 * Hook to fetch blocked users for a specific user
 * @param {string} userId - ID of the user whose blocked list to fetch
 * @returns {Object} { blockedList, loading, error }
 */
export default function useGetBlockedList(userId) {
  const [blockedList, setBlockedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setBlockedList([]);
      setLoading(false);
      return;
    }

    const fetchBlockedUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Reference to Users/{userId}/blockedUsers
        const blockedRef = collection(db, "Users", userId, "blockedUsers");
        const snapshot = await getDocs(blockedRef);

        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBlockedList(list);
      } catch (err) {
        console.error("Error fetching blocked users:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedUsers();
  }, [userId]);

  return { blockedList, loading, error };
}