import React, { useState } from "react";
import ViewPhotoOverlay from "../../Components/Overlays/ViewPhotoOverlay"; // adjust path if needed
import "./PhotosCategories.css";
import { useParams } from "react-router-dom";
import useGetProfileCover from "../../Hooks/useGetProfileCover";

const RANDOM_COVER_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn1XCKLwfD23PmpBQSj0aQREfslkrQ53-jWQ&s";

export default function ViewPhotosCategories() {
  const { userId } = useParams();
  const userCoverPhoto = useGetProfileCover(userId);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const coverPhoto = userCoverPhoto || RANDOM_COVER_URL;

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
