import React from 'react';

const ImageUploadField = ({
  images,
  uploading,
  MAX_IMAGES,
  handleFileUpload,
  handleRemoveImage
}) => {
  return (
    <div className="upload-container">
      <label className="form-label">
        Upload Images (max {MAX_IMAGES})
      </label>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
      />

      {uploading && (
        <p className="uploading-text">Uploading images...</p>
      )}

      <div className="preview-gallery">
        {images.map((img, i) => (
          <div
            key={i}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <img
              src={img}
              alt={`Uploaded ${i}`}
              className="preview-media"
            />

            <button
              type="button"
              onClick={() => handleRemoveImage(i)}
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'red',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploadField;
