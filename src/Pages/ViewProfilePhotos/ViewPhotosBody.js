import React, { useState, useEffect, useRef } from "react";
import ViewPhotoOverlay from "../../Components/Overlays/ViewPhotoOverlay";
import "./PhotosBody.css";
import useGetPhotos from "../../Hooks/useGetPhotos";
import { useParams } from "react-router-dom";

export default function ViewPhotosBody() {
  const { userId } = useParams();
  const { photos: userPhotos, loading, error } = useGetPhotos(userId);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const photoUrls = (userPhotos || []).map(p => p.photoUrl);

  const galleryRef = useRef(null);

  useEffect(() => {
    if (
      selectedIndex !== null &&
      userPhotos &&
      selectedIndex >= userPhotos.length
    ) {
      setSelectedIndex(null);
    }
  }, [userPhotos, selectedIndex]);

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
          {!userPhotos || userPhotos.length === 0 ? (
            <div className="myphotos-no-posts-message">
              No photos uploaded yet.
            </div>
          ) : (
            <div className="myphotos-gallery-grid">
              {userPhotos.map((photo, index) => (
                <div
                  className="myphotos-card"
                  key={photo.id}
                  onClick={() => setSelectedIndex(index)}
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
      {selectedIndex !== null && (
      <ViewPhotoOverlay
        photos={photoUrls}
        startIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        caption={userPhotos[selectedIndex]?.caption}
        createdAt={userPhotos[selectedIndex]?.createdAt}
      />
      )}
    </>
  );
}
