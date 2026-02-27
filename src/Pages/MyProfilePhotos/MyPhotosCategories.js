import React, { useRef, useState, useEffect } from "react";
import ViewPhotoOverlay from "../../Components/Overlays/ViewPhotoOverlay";
import "./PhotosCategories.css";

import useGetProfileCover from "../../Hooks/useGetProfileCover";
import useUploadToCloudinary from "../../Hooks/useUploadToCloudinary";
import useChangeCoverPhoto from "../../Hooks/useChangeCoverPhoto";

import { auth } from "../../Components/firebase";

const RANDOM_COVER_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn1XCKLwfD23PmpBQSj0aQREfslkrQ53-jWQ&s";

export default function MyPhotosCategories() {
  const fileInputRef = useRef(null);
  const user = auth.currentUser;
  const userId = user?.uid;

  const dbCoverPhoto = useGetProfileCover(userId);

  const { uploadImage, loading: uploading } = useUploadToCloudinary();
  const { changeCoverPhoto, loading: saving, error } = useChangeCoverPhoto();

  const [coverPhoto, setCoverPhoto] = useState(RANDOM_COVER_URL);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // Sync cover photo from DB
  useEffect(() => {
    if (dbCoverPhoto) {
      setCoverPhoto(dbCoverPhoto);
    }
  }, [dbCoverPhoto]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    // Instant preview
    const previewUrl = URL.createObjectURL(file);
    setCoverPhoto(previewUrl);

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadImage(file);
    if (!cloudinaryUrl) return;

    // Save URL to Firestore
    await changeCoverPhoto(userId, cloudinaryUrl);

    // Replace preview with final hosted image
    setCoverPhoto(cloudinaryUrl);
  };

  return (
    <div className="myphotos-cover-container">
      <div
        className="myphotos-cover-image"
        style={{ backgroundImage: `url(${coverPhoto})` }}
        onClick={() => setIsOverlayOpen(true)}
      />

      <button
        className="myphotos-cover-btn"
        onClick={handleButtonClick}
        disabled={uploading || saving}
      >
        {uploading || saving ? "Updating..." : "Change Cover Photo"}
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {isOverlayOpen && (
        <ViewPhotoOverlay
          photoUrl={coverPhoto}
          onClose={() => setIsOverlayOpen(false)}
        />
      )}

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}