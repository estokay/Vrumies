import React, { useRef, useState } from "react";
import ViewPhotoOverlay from "../../Components/ViewPhotoOverlay"; // adjust path if needed
import "./PhotosCategories.css";
import useGetProfileCover from "../../Components/Hooks/useGetProfileCover";
import { auth } from "../../Components/firebase";

const RANDOM_COVER_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn1XCKLwfD23PmpBQSj0aQREfslkrQ53-jWQ&s";

export default function MyPhotosCategories() {
  const fileInputRef = useRef(null);
  const user = auth.currentUser;
  const userId = user?.uid;
  const userCoverPhoto = useGetProfileCover(userId);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState(userCoverPhoto || RANDOM_COVER_URL);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setCoverPhoto(previewUrl);
  };

  const handleImageClick = () => {
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <div className="myphotos-cover-container">
      <div
        className="myphotos-cover-image"
        style={{ backgroundImage: `url(${coverPhoto})` }}
        onClick={handleImageClick} // make entire image clickable
      />

      <button className="myphotos-cover-btn" onClick={handleButtonClick}>
        Change Cover Photo
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {isOverlayOpen && (
        <ViewPhotoOverlay photoUrl={coverPhoto} onClose={handleCloseOverlay} />
      )}
    </div>
  );
}
