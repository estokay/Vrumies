import React, { useState, useEffect, useRef } from "react";
import ViewPhotoOverlay from "../../Components/ViewPhotoOverlay";
import "./PhotosBody.css";
import { auth } from "../../Components/firebase";
import UploadPhotoOverlay from "../../Components/UploadPhotoOverlay";
import useGetPhotos from "../../Components/Hooks/useGetPhotos";
import useDeletePhoto from "../../Components/Hooks/useDeletePhoto";

export default function MyPhotosBody() {
  const user = auth.currentUser;
  const userId = user?.uid;
  const [uploadOverlayOpen, setUploadOverlayOpen] = useState(false);
  const { photos: userPhotos, loading, error } = useGetPhotos(userId);
  const { deletePhoto, loading: deleting, error: deleteError } = useDeletePhoto();

  
  const galleryRef = useRef(null);

  // Overlay state
  const [selectedPhoto, setSelectedPhoto] = useState(null);


  // Delete photo
  const handleDelete = async (photoId) => {
    if (!userId) return;

    // 🔒 Confirm first
    if (!window.confirm("Delete this photo?")) return;

    await deletePhoto(userId, photoId);
  };

  return (
    <div className="myphotos-profile-body">
      {/* Header */}
      <div className="myphotos-gallery-header">
        <h2 className="myphotos-body-title">Photos</h2>
        <button
          className="myphotos-upload-btn"
          onClick={() => setUploadOverlayOpen(true)}
        >
          Upload Photos
        </button>
      </div>

      {/* Scrollable Gallery */}
      <div
        className="myphotos-gallery-scroll"
        ref={galleryRef}
      >
        {userPhotos.length === 0 ? (
          <div className="myphotos-no-posts-message">No photos uploaded yet.</div>
        ) : (
          <div className="myphotos-gallery-grid">
            {userPhotos.map((photo) => (
              <div className="myphotos-card" key={photo.id}>
                <img
                  src={photo.photoUrl}
                  alt="User upload"
                  onClick={() => setSelectedPhoto(photo)}
                  style={{ cursor: "pointer" }}
                />
                <button
                  className="myphotos-delete-btn"
                  onClick={() => handleDelete(photo.id)}
                  disabled={deleting}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ViewPhotoOverlay */}
      {selectedPhoto && (
        <ViewPhotoOverlay 
          photoUrl={selectedPhoto.photoUrl} 
          onClose={() => setSelectedPhoto(null)}
          caption={selectedPhoto.caption}
          createdAt={selectedPhoto.createdAt}
        />
      )}

      {uploadOverlayOpen && (
        <UploadPhotoOverlay
          onClose={() => setUploadOverlayOpen(false)}
          onUploadComplete={() => setUploadOverlayOpen(false)}
        />
      )}
    </div>
  );
}
