import React from 'react';

const PostImages = ({ formData, handleFileUpload, handleRemoveImage, uploading, MAX_IMAGES }) => {
  return (
    <div className="directory-upload-container">
      <label className="directory-form-label">Upload Images (max {MAX_IMAGES})</label>
      <input type="file" accept="image/*" multiple onChange={handleFileUpload} />
      {uploading && <p className="directory-uploading-text">Uploading images...</p>}
      <div className="directory-preview-images-row">
        {formData.images.map((img, idx) => (
          <div key={idx} className="directory-preview-wrapper">
            <img src={img} alt={`Uploaded ${idx + 1}`} className="directory-preview-media" />
            <button type="button" onClick={() => handleRemoveImage(idx)} className="directory-remove-image-btn">✖</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostImages;
