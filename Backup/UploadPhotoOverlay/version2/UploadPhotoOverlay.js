import React, { useState } from "react";
import "./UploadPhotoOverlay.css";

const MAX_PHOTOS = 25;

const UploadPhotoOverlay = ({ onClose, onUploadComplete }) => {
  const [items, setItems] = useState([]); // [{ file, preview, caption }]
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);

    if (items.length + selected.length > MAX_PHOTOS) {
      alert(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
      return;
    }

    const newItems = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: "",
    }));

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleCaptionChange = (index, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, caption: value } : item
      )
    );
  };

  const handleUpload = async () => {
    if (items.length === 0) return;

    setLoading(true);

    // Simulated upload
    setTimeout(() => {
      if (onUploadComplete) {
        onUploadComplete(items);
      }
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
          {items.map((item, i) => (
            <div className="preview-row" key={i}>
              <img src={item.preview} alt={`Preview ${i}`} />

              <input
                type="text"
                placeholder="Enter caption..."
                value={item.caption}
                onChange={(e) =>
                  handleCaptionChange(i, e.target.value)
                }
              />
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