import React from 'react';

const PostImages = ({ images, uploading, onFileUpload, onRemoveImage, maxImages }) => (
  <div className="mpf-upload-container">
    <label className="mpf-form-label">Upload Images (max {maxImages})</label>
    <input type="file" accept="image/*" multiple onChange={onFileUpload} />
    {uploading && <p className="mpf-uploading-text">Uploading images...</p>}
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
      {images.map((img, index) => (
        <div key={index} style={{ position: 'relative' }}>
          <img src={img} alt={`Uploaded ${index}`} className="mpf-preview-media" />
          <button
            type="button"
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: 'red',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              cursor: 'pointer'
            }}
            onClick={() => onRemoveImage(index)}
          >
            ✖
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default PostImages;
