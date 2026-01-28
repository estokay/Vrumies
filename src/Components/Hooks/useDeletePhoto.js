import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed

const useDeletePhoto = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePhoto = async (userId, photoId) => {
    if (!userId || !photoId) {
      setError(new Error("userId and photoId are required"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const photoRef = doc(db, "Users", userId, "Photos", photoId);
      await deleteDoc(photoRef);
    } catch (err) {
      console.error("Error deleting photo:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { deletePhoto, loading, error };
};

export default useDeletePhoto;