import React, { useState } from 'react';
import './EventPostForm.css';
import { db } from '../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

const EventPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    address: '',
    link: '',
    tokens: '',
    eventDateTime: '',
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
    if (!e.target.files.length) return;
    if (formData.images.length >= 7) {
      alert('Maximum 7 images allowed.');
      return;
    }

    const file = e.target.files[0];
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

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setMessage('❌ You must be signed in to submit a post.');
      return;
    }

    try {
      await addDoc(collection(db, 'Posts'), {
        ...formData,
        tokens: formData.tokens || 0,
        eventDateTime: formData.eventDateTime
          ? Timestamp.fromDate(new Date(formData.eventDateTime))
          : null,
        createdAt: Timestamp.now(),
        type: 'event',
        userId: user.uid,
      });
      setMessage('✅ Event post added!');
      setSubmitted(true);
    } catch (err) {
      console.error('Firestore error:', err);
      setMessage('❌ Failed to add post.');
    }
  };

  const publicPath = process.env.PUBLIC_URL;

  return submitted ? (
    <div className="event-success-message">
      <p>{message}</p>
    </div>
  ) : (
    <form className="event-post-form" onSubmit={handleSubmit}>
      {/* Title */}
      <label className="event-form-label">Title</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      {/* Description */}
      <label className="event-form-label">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      {/* Toggle Buttons */}
      <div className="event-toggle-buttons-row">
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} alt="Address" onClick={() => toggleField('address')} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} alt="Link" onClick={() => toggleField('link')} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} alt="Image" onClick={() => toggleField('images')} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} alt="Tokens" onClick={() => toggleField('tokens')} />
        <img src={`${publicPath}/PostCreationIcons/Calendar-Icon.png`} alt="Calendar" onClick={() => toggleField('eventDateTime')} />
        <img src={`${publicPath}/PostCreationIcons/Price-Icon.png`} alt="Price" onClick={() => toggleField('price')} />
      </div>

      {/* Address */}
      <input
        type="text"
        name="address"
        placeholder="Enter address"
        value={formData.address}
        onChange={handleChange}
        className={activeField === 'address' ? '' : 'event-hidden-input'}
      />

      {/* Link */}
      <input
        type="text"
        name="link"
        placeholder="Enter link"
        value={formData.link}
        onChange={handleChange}
        className={activeField === 'link' ? '' : 'event-hidden-input'}
      />

      {/* Image Upload */}
      {activeField === 'images' && (
        <div className="event-upload-container">
          <label className="event-form-label">Upload Images (max 7)</label>
          <input type="file" accept="image/*" onChange={handleFileUpload} />
          {uploading && <p className="event-uploading-text">Uploading image...</p>}
          <div className="event-images-preview">
            {formData.images.map((img, index) => (
              <div key={index} className="event-image-wrapper">
                <img src={img} alt={`Uploaded ${index}`} className="event-preview-media" />
                <button type="button" className="event-remove-btn" onClick={() => removeImage(index)}>×</button>
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
        className={activeField === 'tokens' ? '' : 'event-hidden-input'}
      />

      {/* Event Date & Time */}
      {activeField === 'eventDateTime' && (
        <input
          type="datetime-local"
          name="eventDateTime"
          value={formData.eventDateTime}
          onChange={handleChange}
          className="event-datetime-input"
        />
      )}

      {/* Price input with auto-formatting */}
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
          className="event-datetime-input"
        />
      )}

      <button type="submit" className="event-submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default EventPostForm;
