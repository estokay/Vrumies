import React, { useState } from 'react';
import './RequestPostForm.css';
import { db } from '../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import axios from 'axios';

const RequestPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [], // changed to array to allow multiple images
    address: '',
    link: '',
    tokens: '',
    urgency: 'I Can Wait',
  });
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const CLOUDINARY_PRESET = 'vrumies_preset';
  const CLOUDINARY_CLOUD_NAME = 'dmjvngk3o';

  const toggleField = (field) => {
    setActiveField((prev) => (prev === field ? null : field));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tokens' ? (Number(value) || 0) : value,
    }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (formData.images.length + files.length > 7) {
      alert('⚠️ You can only upload up to 7 images per post.');
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('upload_preset', CLOUDINARY_PRESET);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          formDataUpload
        );
        return res.data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'Posts'), {
        ...formData,
        tokens: formData.tokens || 0,
        createdAt: Timestamp.now(),
        type: 'request',
      });
      setMessage('✅ Request post added!');
      setSubmitted(true);
    } catch (err) {
      console.error('Firestore error:', err);
      setMessage('❌ Failed to add post.');
    }
  };

  const publicPath = process.env.PUBLIC_URL;

  return submitted ? (
    <div className="post-success-message">
      <p>{message}</p>
    </div>
  ) : (
    <form className="post-form" onSubmit={handleSubmit}>
      {/* Title */}
      <label className="form-label">Title</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      {/* Description */}
      <label className="form-label">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      {/* Toggle Buttons */}
      <div className="toggle-buttons-row">
        <img
          src={`${publicPath}/PostCreationIcons/Map-Icon.png`}
          alt="Address"
          onClick={() => toggleField('address')}
        />
        <img
          src={`${publicPath}/PostCreationIcons/Link-Icon.png`}
          alt="Link"
          onClick={() => toggleField('link')}
        />
        <img
          src={`${publicPath}/PostCreationIcons/Image-Icon.png`}
          alt="Image"
          onClick={() => toggleField('image')}
        />
        <img
          src={`${publicPath}/PostCreationIcons/Token-Icon.png`}
          alt="Tokens"
          onClick={() => toggleField('tokens')}
        />
        <img
          src={`${publicPath}/PostCreationIcons/Urgency-Icon.png`}
          alt="Urgency"
          onClick={() => toggleField('urgency')}
        />
      </div>

      {/* Address */}
      <input
        type="text"
        name="address"
        placeholder="Enter address"
        value={formData.address}
        onChange={handleChange}
        className={activeField === 'address' ? '' : 'hidden-input'}
      />

      {/* Link */}
      <input
        type="text"
        name="link"
        placeholder="Enter link"
        value={formData.link}
        onChange={handleChange}
        className={activeField === 'link' ? '' : 'hidden-input'}
      />

      {/* Image Upload */}
      {activeField === 'image' && (
        <div className="upload-container">
          <label className="form-label">Upload Images (max 7)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
          />
          {uploading && <p className="uploading-text">Uploading images...</p>}
          {formData.images.length > 0 && (
            <div className="preview-gallery">
              {formData.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Uploaded ${i}`}
                  className="preview-media"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tokens */}
      <input
        type="number"
        name="tokens"
        placeholder="Enter token amount"
        value={formData.tokens}
        onChange={handleChange}
        className={activeField === 'tokens' ? '' : 'hidden-input'}
      />

      {/* Urgency */}
      {activeField === 'urgency' && (
        <select
          name="urgency"
          value={formData.urgency}
          onChange={handleChange}
          className="urgency-select"
        >
          <option value="Urgent">Urgent</option>
          <option value="I Can Wait">I Can Wait</option>
          <option value="Just Looking">Just Looking</option>
        </select>
      )}

      <button type="submit" className="submit-btn">Submit</button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default RequestPostForm;
