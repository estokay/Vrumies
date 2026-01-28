import { useState } from "react";
import axios from "axios";

const useUploadToCloudinary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    if (!file) {
      setError("No file provided");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "vrumies_preset"); // unsigned preset

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dmjvngk3o/image/upload",
        formData
      );

      return res.data.secure_url; // ✅ STRING URL
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setError("Failed to upload image");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { uploadImage, loading, error };
};

export default useUploadToCloudinary;