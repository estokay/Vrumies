import React, { useState, useEffect } from "react";
import "./UploadPhotoOverlay.css";

const MAX_PHOTOS = 25;

const UploadPhotoOverlay = ({ onClose, onUploadComplete }) => {
  const [items, setItems] = useState([]); // [{ id, file, preview, caption }]
  const [loading, setLoading] = useState(false);

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

    // Simulated upload
    setTimeout(() => {
      if (onUploadComplete) {
        onUploadComplete(items);
      }
      // Revoke all URLs after upload
      items.forEach((item) => URL.revokeObjectURL(item.preview));

      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="upload-overlay">
      <div className="upload-overlay-content">
        <h2>Upload Photos</h2>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={items.length >= MAX_PHOTOS}
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
          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
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