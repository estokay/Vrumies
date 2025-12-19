import React, { useState, useEffect, useRef } from "react";
import ViewPhotoOverlay from "../../Components/ViewPhotoOverlay";
import "./PhotosBody.css";

export default function ViewPhotosBody() {
  const INITIAL_COUNT = 25;
  const LOAD_COUNT = 10;

  const [photos, setPhotos] = useState(
    Array.from(
      { length: INITIAL_COUNT },
      (_, i) => `https://picsum.photos/400/400?random=${i + 1}`
    )
  );

  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

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
      (_, i) =>
        `https://picsum.photos/400/400?random=${
          INITIAL_COUNT + (page - 1) * LOAD_COUNT + i + 1
        }`
    );

    setPhotos((prev) => [...prev, ...newPhotos]);
  }, [page]);

  // Upload photos (add to top)
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...newPhotos, ...prev]);
  };

  return (
    <>
      <div className="myphotos-profile-body">
        {/* Header */}
        <div className="myphotos-gallery-header">
          <h2 className="myphotos-body-title">Photos</h2>
          <label className="myphotos-upload-btn">
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
          className="myphotos-gallery-scroll"
          ref={galleryRef}
          onScroll={handleScroll}
        >
          {photos.length === 0 ? (
            <div className="myphotos-no-posts-message">
              No photos uploaded yet.
            </div>
          ) : (
            <div className="myphotos-gallery-grid">
              {photos.map((src, index) => (
                <div
                  className="myphotos-card"
                  key={index}
                  onClick={() => setSelectedPhoto(src)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={src} alt={`User upload ${index}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Photo Overlay */}
      <ViewPhotoOverlay
        photoUrl={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </>
  );
}
