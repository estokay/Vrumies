import React, { useState } from "react";
import ViewPhotoOverlay from "../../Components/ViewPhotoOverlay"; // adjust path if needed
import "./PhotosCategories.css";

const RANDOM_COVER_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn1XCKLwfD23PmpBQSj0aQREfslkrQ53-jWQ&s";

export default function ViewPhotosCategories() {
  const [coverPhoto] = useState(RANDOM_COVER_URL);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleImageClick = () => {
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <div className="viewphotoscategories-cover-container">
      <div
        className="viewphotoscategories-cover-image"
        style={{ backgroundImage: `url(${coverPhoto})` }}
        onClick={handleImageClick} // entire image clickable
      />

      {isOverlayOpen && (
        <ViewPhotoOverlay photoUrl={coverPhoto} onClose={handleCloseOverlay} />
      )}
    </div>
  );
}
