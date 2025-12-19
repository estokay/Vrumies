import React, { useState, useEffect, useRef } from "react";
import "./PhotosBody.css";

export default function MyPhotosBody() {
  const INITIAL_COUNT = 25; // initial photos
  const LOAD_COUNT = 10;    // photos to load each scroll
  const [photos, setPhotos] = useState(
    Array.from({ length: INITIAL_COUNT }, (_, i) => `https://picsum.photos/400/400?random=${i + 1}`)
  );

  const [page, setPage] = useState(1);
  const galleryRef = useRef(null);

  // Load more photos on scroll
  const handleScroll = () => {
    if (!galleryRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = galleryRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    const newPhotos = Array.from(
      { length: LOAD_COUNT },
      (_, i) => `https://picsum.photos/400/400?random=${INITIAL_COUNT + (page - 1) * LOAD_COUNT + i + 1}`
    );
    setPhotos((prev) => [...prev, ...newPhotos]);
  }, [page]);

  // Upload photos (appear at top)
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...newPhotos, ...prev]);
  };

  // Delete photo
  const handleDelete = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="my-profile-body">
      {/* Header */}
      <div className="photo-gallery-header">
        <h2 className="profile-body-title">Photos</h2>
        <label className="upload-photo-btn">
          Upload Photos
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            hidden
          />
        </label>
      </div>

      {/* Scrollable Gallery */}
      <div
        className="photo-gallery-scroll"
        ref={galleryRef}
        onScroll={handleScroll}
      >
        {photos.length === 0 ? (
          <div className="no-posts-message">No photos uploaded yet.</div>
        ) : (
          <div className="photo-gallery-grid">
            {photos.map((src, index) => (
              <div className="photo-card" key={index}>
                <img src={src} alt={`User upload ${index}`} />
                <button
                  className="delete-photo-btn"
                  onClick={() => handleDelete(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
