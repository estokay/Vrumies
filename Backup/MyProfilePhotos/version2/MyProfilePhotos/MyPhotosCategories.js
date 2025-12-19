import React, { useRef, useState } from "react";
import "./PhotosCategories.css";

const RANDOM_COVER_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn1XCKLwfD23PmpBQSj0aQREfslkrQ53-jWQ&s";

export default function MyPhotosCategories() {
  const fileInputRef = useRef(null);
  const [coverPhoto, setCoverPhoto] = useState(RANDOM_COVER_URL);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setCoverPhoto(previewUrl);
  };

  return (
    <div className="profile-cover-container">
      <div
        className="profile-cover-image"
        style={{ backgroundImage: `url(${coverPhoto})` }}
      />

      <button
        className="profile-cover-btn"
        onClick={handleButtonClick}
      >
        Change Cover Photo
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
