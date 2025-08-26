import React, { useState } from 'react';
import './DirectoryPostForm.css';
import { db } from '../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import axios from 'axios';

const DirectoryPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    link: '',
    tokens: '',
    images: [],
    serviceLocation: '',
    businessAddress: '', // for Business Address input
  });
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const CLOUDINARY_PRESET = 'vrumies_preset';
  const CLOUDINARY_CLOUD_NAME = 'dmjvngk3o';
  const MAX_IMAGES = 7;

  const toggleField = (field) => {
    setActiveField((prev) => (prev === field ? null : field));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tokens' ? Number(value) || 0 : value,
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (formData.images.length >= MAX_IMAGES) {
      alert(`You can upload up to ${MAX_IMAGES} images.`);
      return;
    }

    setUploading(true);

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', CLOUDINARY_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formDataUpload
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, res.data.secure_url],
      }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'Posts'), {
        ...formData,
        tokens: formData.tokens || 0,
        createdAt: Timestamp.now(),
        type: 'directory',
      });
      setMessage('✅ Directory post added!');
      setSubmitted(true);
    } catch (err) {
      console.error('Firestore error:', err);
      setMessage('❌ Failed to add directory post.');
    }
  };

  const publicPath = process.env.PUBLIC_URL;

  return submitted ? (
    <div className="directory-success-message">
      <p>{message}</p>
    </div>
  ) : (
    <form className="directory-post-form" onSubmit={handleSubmit}>
      <label className="directory-form-label">Title</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} required />

      <label className="directory-form-label">Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      <div className="directory-toggle-buttons-row">
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} alt="Address" onClick={() => toggleField('address')} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} alt="Link" onClick={() => toggleField('link')} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} alt="Images" onClick={() => toggleField('images')} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} alt="Tokens" onClick={() => toggleField('tokens')} />
        <img src={`${publicPath}/PostCreationIcons/ServiceLocation-Icon.png`} alt="Service Location" onClick={() => toggleField('serviceLocation')} />
      </div>

      <input
        type="text"
        name="address"
        placeholder="Enter address"
        value={formData.address}
        onChange={handleChange}
        className={activeField === 'address' ? '' : 'directory-hidden-input'}
      />

      <input
        type="text"
        name="link"
        placeholder="Enter link"
        value={formData.link}
        onChange={handleChange}
        className={activeField === 'link' ? '' : 'directory-hidden-input'}
      />

      {/* Image Upload Section */}
      {activeField === 'images' && (
        <div className="directory-upload-container">
          <label className="directory-form-label">Upload Images (max {MAX_IMAGES})</label>
          <input type="file" accept="image/*" onChange={handleFileUpload} />
          {uploading && <p className="directory-uploading-text">Uploading image...</p>}
          <div className="directory-preview-images-row">
            {formData.images.map((img, idx) => (
              <div key={idx} className="directory-preview-wrapper">
                <img src={img} alt={`Uploaded ${idx + 1}`} className="directory-preview-media" />
                <button type="button" onClick={() => handleRemoveImage(idx)} className="directory-remove-image-btn">✖</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        type="number"
        name="tokens"
        placeholder="Enter token amount"
        value={formData.tokens}
        onChange={handleChange}
        className={activeField === 'tokens' ? '' : 'directory-hidden-input'}
      />

      {/* Service Location Dropdown */}
      {activeField === 'serviceLocation' && (
        <>
          <select
            name="serviceLocation"
            value={formData.serviceLocation}
            onChange={handleChange}
            className="directory-dropdown"
          >
            <option value="">Select service location</option>
            <option value="Business Address">Business Address</option>
            <option value="Customer Address">Customer Address</option>
          </select>

          {/* Additional Business Address input */}
          {formData.serviceLocation === 'Business Address' && (
            <input
              type="text"
              name="businessAddress"
              placeholder="Enter business address"
              value={formData.businessAddress}
              onChange={handleChange}
              className="directory-post-form-input"
            />
          )}
        </>
      )}

      <button type="submit" className="directory-submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default DirectoryPostForm;
