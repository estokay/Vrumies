import React, { useState } from "react";
import { FaExpand } from "react-icons/fa";
import "./PhotosCategories.css";

const RANDOM_COVER_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn1XCKLwfD23PmpBQSj0aQREfslkrQ53-jWQ&s";

export default function ViewPhotosCategories() {
  const [coverPhoto] = useState(RANDOM_COVER_URL);

  const handleExpandClick = () => {
    window.open(coverPhoto, "_blank");
  };

  return (
    <div className="viewphotoscategories-cover-container">
      <div
        className="viewphotoscategories-cover-image"
        style={{ backgroundImage: `url(${coverPhoto})` }}
      />
      <button
        className="viewphotoscategories-expand-btn"
        onClick={handleExpandClick}
        title="Open image in new tab"
      >
        <FaExpand />
      </button>
    </div>
  );
}
