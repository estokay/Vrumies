import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../Components/firebase"; // import your firebase config
import useUploadToCloudinary from "./useUploadToCloudinary";

const useUploadToPhoto = (userId) => {
  const { uploadImage, loading: cloudinaryLoading, error: cloudinaryError } = useUploadToCloudinary();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * photos: array of { file, caption }
   */
  const uploadPhotos = async (photos) => {
    if (!userId) {
      setError("No userId provided");
      return null;
    }

    if (!photos || photos.length === 0) {
      setError("No photos to upload");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const photoDocs = [];

      for (const photo of photos) {
        // 1️⃣ Upload to Cloudinary
        const photoUrl = await uploadImage(photo.file);
        if (!photoUrl) throw new Error("Failed to upload image to Cloudinary");

        // 2️⃣ Add to Firebase subcollection
        const photosRef = collection(db, "Users", userId, "Photos");
        const docRef = await addDoc(photosRef, {
          createdAt: serverTimestamp(),
          photoUrl,
          caption: photo.caption || "",
        });

        photoDocs.push({ id: docRef.id, photoUrl, caption: photo.caption || "" });
      }

      setLoading(false);
      return photoDocs; // return uploaded photo info
    } catch (err) {
      console.error("Upload to Firebase error:", err);
      setError(err.message || "Failed to upload photos");
      setLoading(false);
      return null;
    }
  };

  return { uploadPhotos, loading: loading || cloudinaryLoading, error: error || cloudinaryError };
};

export default useUploadToPhoto;