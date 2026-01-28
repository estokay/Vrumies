import React, { useState, useEffect, useRef } from "react";
import ViewPhotoOverlay from "../../Components/ViewPhotoOverlay";
import "./PhotosBody.css";
import useGetPhotos from "../../Components/Hooks/useGetPhotos";
import { useParams } from "react-router-dom";

export default function ViewPhotosBody() {
  const { userId } = useParams();
  const { photos: userPhotos, loading, error } = useGetPhotos(userId);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const galleryRef = useRef(null);

  return (
    <>
      <div className="myphotos-profile-body">
        {/* Header */}
        <div className="myphotos-gallery-header">
          <h2 className="myphotos-body-title">Photos</h2>
        </div>

        {/* Scrollable Gallery */}
        <div
          className="myphotos-gallery-scroll"
          ref={galleryRef}
        >
          {userPhotos.length === 0 ? (
            <div className="myphotos-no-posts-message">
              No photos uploaded yet.
            </div>
          ) : (
            <div className="myphotos-gallery-grid">
              {userPhotos.map((photo) => (
                <div
                  className="myphotos-card"
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={photo.photoUrl} alt={photo.caption || "User upload"} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Photo Overlay */}
      {selectedPhoto && (
      <ViewPhotoOverlay
        photoUrl={selectedPhoto.photoUrl}
        onClose={() => setSelectedPhoto(null)}
        caption={selectedPhoto.caption}
        createdAt={selectedPhoto.createdAt}
      />
      )}
    </>
  );
}
