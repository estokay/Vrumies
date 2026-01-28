import React from 'react';

const EventImagesToggle = ({
  images,
  uploading,
  maxImages,
  onUpload,
  onRemove
}) => {
  return (
    <div className="event-upload-container">
      <label className="event-form-label">
        Upload Images (max {maxImages})
      </label>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onUpload}
      />

      {uploading && (
        <p className="event-uploading-text">Uploading images...</p>
      )}

      <div className="event-images-preview">
        {images.map((img, index) => (
          <div key={index} className="event-image-wrapper">
            <img
              src={img}
              alt={`Uploaded ${index}`}
              className="event-preview-media"
            />
            <button
              type="button"
              className="event-remove-btn"
              onClick={() => onRemove(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventImagesToggle;
