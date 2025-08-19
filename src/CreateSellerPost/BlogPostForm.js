import React, { useState } from 'react';
import './BlogPostForm.css';
import { db } from '../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import axios from 'axios';

const BlogPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    link: '',
    tokens: '',
    image: ''
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
      [name]: name === 'tokens' ? Number(value) : value,
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
        image: res.data.secure_url,
      }));
    } catch (err) {
      console.error(`Upload failed:`, err);
      alert(`Image upload failed`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'blogPosts'), {
        ...formData,
        createdAt: Timestamp.now(),
      });
      setMessage('✅ Blog post added!');
      setSubmitted(true);
    } catch (err) {
      console.error('❌ Firestore error:', err);
      setMessage('❌ Failed to add post.');
    }
  };

  const publicPath = process.env.PUBLIC_URL;

  return submitted ? (
    <div className="bpf-post-success-message">
      <p>{message}</p>
    </div>
  ) : (
    <form className="bpf-post-form" onSubmit={handleSubmit}>
      {/* Title */}
      <label className="bpf-form-label">Title</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      {/* Description */}
      <label className="bpf-form-label">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      {/* Toggle Buttons */}
      <div className="bpf-toggle-buttons-row">
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
      </div>

      {/* Address */}
      <input
        type="text"
        name="address"
        placeholder="Enter address"
        value={formData.address}
        onChange={handleChange}
        className={activeField === 'address' ? '' : 'bpf-hidden-input'}
      />

      {/* Link */}
      <input
        type="text"
        name="link"
        placeholder="Enter link"
        value={formData.link}
        onChange={handleChange}
        className={activeField === 'link' ? '' : 'bpf-hidden-input'}
      />

      {/* Image Upload */}
      {activeField === 'image' && (
        <div className="bpf-upload-container">
          <label className="bpf-form-label">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
          />
          {uploading && <p className="bpf-uploading-text">Uploading image...</p>}
          {formData.image && (
            <img src={formData.image} alt="Uploaded" className="bpf-preview-media" />
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
        className={activeField === 'tokens' ? '' : 'bpf-hidden-input'}
      />

      <button type="submit" className="bpf-submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default BlogPostForm;
