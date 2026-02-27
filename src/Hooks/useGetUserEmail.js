import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Components/firebase"; // adjust path to your firebase.js

export default function useGetUserEmail(userId) {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setEmail(null);
      setLoading(false);
      return;
    }

    const fetchEmail = async () => {
      setLoading(true);
      try {
        const userDocRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          setEmail(userSnap.data().email || null);
        } else {
          setEmail(null); // user not found
        }
      } catch (err) {
        console.error("Error fetching user email:", err);
        setError(err);
        setEmail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [userId]);

  return { email, loading, error };
}