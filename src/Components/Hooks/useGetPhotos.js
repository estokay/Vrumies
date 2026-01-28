import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed

const useGetPhotos = (userId) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setPhotos([]);
      setLoading(false);
      return;
    }

    const photosRef = collection(db, "Users", userId, "Photos");

    const unsubscribe = onSnapshot(
      photosRef,
      (snapshot) => {
        const photosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPhotos(photosData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching photos:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { photos, loading, error };
};

export default useGetPhotos;