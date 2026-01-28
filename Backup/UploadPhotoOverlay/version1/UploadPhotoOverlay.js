import React, { useState } from "react";
import "./UploadPhotoOverlay.css";

const UploadPhotoOverlay = ({ onClose, onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  // Simulate upload
  const handleUpload = async () => {
    if (files.length === 0) return;

    setLoading(true);

    // Simulate upload delay
    setTimeout(() => {
      const fakeUrls = previews; // For now, just use the previews
      if (onUploadComplete) onUploadComplete(fakeUrls);
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="upload-overlay">
      <div className="upload-overlay-content">
        <h2>Upload Photos</h2>
        <input type="file" multiple accept="image/*" onChange={handleFileSelect} />
        
        {previews.length > 0 && (
          <div className="preview-grid">
            {previews.map((src, i) => (
              <div className="preview-card" key={i}>
                <img src={src} alt={`Preview ${i}`} />
              </div>
            ))}
          </div>
        )}

        <div className="upload-buttons">
          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UploadPhotoOverlay;