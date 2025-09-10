import React, { useState } from 'react';
import './MarketPostForm.css';
import { db } from '../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import axios from 'axios';

const MarketPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    link: '',
    tokens: '',
    images: [],
    condition: '',
    shippingTime: '',
    price: '', // new field
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
      [name]: name === 'tokens' ? Number(value) || 0 : value,
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (formData.images.length >= 7) {
      alert('You can upload a maximum of 7 images.');
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
        createdAt: Timestamp.now(),
        type: 'market',
      });
      setMessage('✅ Market post added!');
      setSubmitted(true);
    } catch (err) {
      console.error('❌ Firestore error:', err);
      setMessage('❌ Failed to add post.');
    }
  };

  const publicPath = process.env.PUBLIC_URL;

  return submitted ? (
    <div className="mpf-post-success-message">
      <p>{message}</p>
    </div>
  ) : (
    <form className="mpf-post-form" onSubmit={handleSubmit}>
      {/* Title */}
      <label className="mpf-form-label">Title</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      {/* Description */}
      <label className="mpf-form-label">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      {/* Toggle Buttons */}
      <div className="mpf-toggle-buttons-row">
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
          src={`${publicPath}/PostCreationIcons/Condition-Icon.png`}
          alt="Condition"
          onClick={() => toggleField('condition')}
        />
        <img
          src={`${publicPath}/PostCreationIcons/ShippingTime-Icon.png`}
          alt="Shipping Time"
          onClick={() => toggleField('shippingTime')}
        />
        <img
          src={`${publicPath}/PostCreationIcons/Price-Icon.png`}
          alt="Price"
          onClick={() => toggleField('price')}
        />
      </div>

      {/* Address */}
      <input
        type="text"
        name="address"
        placeholder="Enter address"
        value={formData.address}
        onChange={handleChange}
        className={activeField === 'address' ? '' : 'mpf-hidden-input'}
      />

      {/* Link */}
      <input
        type="text"
        name="link"
        placeholder="Enter link"
        value={formData.link}
        onChange={handleChange}
        className={activeField === 'link' ? '' : 'mpf-hidden-input'}
      />

      {/* Image Upload */}
      {activeField === 'image' && (
        <div className="mpf-upload-container">
          <label className="mpf-form-label">Upload Images (max 7)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
          />
          {uploading && <p className="mpf-uploading-text">Uploading image...</p>}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
            {formData.images.map((img, index) => (
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
                    cursor: 'pointer',
                  }}
                  onClick={() => handleRemoveImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tokens */}
      <input
        type="number"
        name="tokens"
        placeholder="Enter token amount"
        value={formData.tokens}
        onChange={handleChange}
        className={activeField === 'tokens' ? '' : 'mpf-hidden-input'}
      />

      {/* Condition Dropdown */}
      {activeField === 'condition' && (
        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          className="mpf-dropdown"
        >
          <option value="">Select condition</option>
          <option value="New">New</option>
          <option value="Used">Used</option>
        </select>
      )}

      {/* Shipping Time Dropdown */}
      {activeField === 'shippingTime' && (
        <select
          name="shippingTime"
          value={formData.shippingTime}
          onChange={handleChange}
          className="mpf-dropdown"
        >
          <option value="">Select shipping time</option>
          <option value="Local Pickup">Local Pickup</option>
          <option value="2-4 days">2-4 days</option>
          <option value="4-7 days">4-7 days</option>
          <option value="7-10 days">7-10 days</option>
        </select>
      )}

      {/* Price Input */}
      {activeField === 'price' && (
        <input
          type="text"
          name="price"
          placeholder="$0.00"
          value={formData.price || ''}
          onChange={(e) => {
            let value = e.target.value;
            value = value.replace(/[^0-9.]/g, '');
            const floatVal = parseFloat(value);
            if (!isNaN(floatVal)) {
              value = `$${floatVal.toFixed(2)}`;
            } else {
              value = '$0.00';
            }
            setFormData((prev) => ({ ...prev, price: value }));
          }}
          className="mpf-dropdown"
        />
      )}

      <button type="submit" className="mpf-submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default MarketPostForm;
