import React, { useState, useEffect } from "react";
import "./UploadPhotoOverlay.css";
import useUploadToPhoto from "./Hooks/useUploadToPhoto";
import { auth } from "./firebase";

const MAX_PHOTOS = 25;

const UploadPhotoOverlay = ({ onClose, onUploadComplete }) => {
  const user = auth.currentUser;
  const userId = user?.uid;
  const [items, setItems] = useState([]); // [{ id, file, preview, caption }]
  const [loading, setLoading] = useState(false);
  const { uploadPhotos, loading: uploadLoading, error: uploadError } = useUploadToPhoto(userId);
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [items]);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);

    if (items.length + selected.length > MAX_PHOTOS) {
      alert(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
      return;
    }

    const newItems = selected.map((file) => ({
      id: crypto.randomUUID(), // unique ID for each item
      file,
      preview: URL.createObjectURL(file),
      caption: "",
    }));

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleCaptionChange = (id, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, caption: value } : item))
    );
  };

  const handleRemove = (id) => {
    setItems((prev) => {
      const removedItem = prev.find((item) => item.id === id);
      if (removedItem) {
        URL.revokeObjectURL(removedItem.preview); // free memory
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleUpload = async () => {
    if (items.length === 0) return;

    setLoading(true);

    // Map items to { file, caption }
    const photosToUpload = items.map(({ file, caption }) => ({ file, caption }));

    const uploadedPhotos = await uploadPhotos(photosToUpload);

    if (uploadedPhotos) {
      if (onUploadComplete) {
        onUploadComplete(uploadedPhotos); // send back info to parent
      }
      // Revoke all previews
      items.forEach((item) => URL.revokeObjectURL(item.preview));
      onClose();
    } else {
      alert("Failed to upload photos. See console for details.");
    }

    setLoading(false);
  };

  return (
    <div className="upload-overlay">
      <div className="upload-overlay-content">
        <h2>Upload Photos</h2>

        {!userId && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>
            You must be logged in to upload photos
          </p>
        )}

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={items.length >= MAX_PHOTOS || !userId}
        />

        <p className="upload-limit">
          {items.length}/{MAX_PHOTOS} photos selected
        </p>

        {/* Scrollable preview area */}
        <div className="preview-list">
          {items.map((item) => (
            <div className="preview-row" key={item.id}>
              <img src={item.preview} alt="Preview" />

              <input
                type="text"
                placeholder="Enter caption..."
                value={item.caption}
                onChange={(e) =>
                  handleCaptionChange(item.id, e.target.value)
                }
              />

              <button
                className="remove-image-btn"
                onClick={() => handleRemove(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="upload-buttons">
          <button onClick={handleUpload} disabled={loading || uploadLoading}>
            {loading || uploadLoading ? "Uploading..." : "Upload"}
          </button>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPhotoOverlay;