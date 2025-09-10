import React, { useState, useEffect } from 'react';
import './BlogPostForm.css';
import { db } from '../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import axios from 'axios';
import { US_STATES } from './usStates';

const CLOUDINARY_PRESET = 'vrumies_preset';
const CLOUDINARY_CLOUD_NAME = 'dmjvngk3o';
const MAX_IMAGES = 7;

const BlogPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    tokens: '',
    images: [],
  });
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cityList, setCityList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const publicPath = process.env.PUBLIC_URL;

  // Toggle optional fields
  const toggleField = (field) => setActiveField((prev) => (prev === field ? null : field));

  // Handle text/number input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tokens') {
      setFormData((prev) => ({ ...prev, tokens: Number(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Fetch cities when state changes using Google Places JS Library
  useEffect(() => {
    if (!selectedState || !window.google) {
      setCityList([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();

    service.getPlacePredictions(
      {
        input: '',
        types: ['(cities)'],
        componentRestrictions: { country: 'us', administrativeArea: selectedState },
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setCityList(predictions.map((p) => p.structured_formatting.main_text));
        } else {
          setCityList([]);
        }
      }
    );
  }, [selectedState]);

  // Handle file upload to Cloudinary
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (formData.images.length + files.length > MAX_IMAGES) {
      alert(`⚠️ Max ${MAX_IMAGES} images allowed.`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', CLOUDINARY_PRESET);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          data
        );
        return res.data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    } catch (err) {
      console.error('Upload failed', err);
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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedState || !selectedCity) {
      alert('Please select both state and city.');
      return;
    }

    const postData = {
      title: formData.title,
      description: formData.description,
      location: { state: selectedState, city: selectedCity },
      link: formData.link,
      images: formData.images,
      tokens: formData.tokens,
      createdAt: Timestamp.now(),
      type: 'blog',
      likesCounter: 0,
      dislikesCounter: 0,
      likes: [],
      dislikes: [],
    };

    try {
      await addDoc(collection(db, 'Posts'), postData);
      setMessage('✅ Blog post added!');
      setSubmitted(true);
    } catch (err) {
      console.error('Firestore error:', err);
      setMessage('❌ Failed to add post.');
    }
  };

  return submitted ? (
    <div className="post-success-message">{message}</div>
  ) : (
    <form className="post-form" onSubmit={handleSubmit}>
      <label className="form-label">Title</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} required />

      <label className="form-label">Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      <div className="toggle-buttons-row">
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} alt="Location" onClick={() => toggleField('location')} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} alt="Link" onClick={() => toggleField('link')} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} alt="Image" onClick={() => toggleField('image')} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} alt="Tokens" onClick={() => toggleField('tokens')} />
      </div>

      {/* State & City Dropdown */}
      {activeField === 'location' && (
        <>
          <label className="form-label">State</label>
          <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} required>
            <option value="">Select a state</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>

          <label className="form-label">City</label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} required disabled={!selectedState}>
            <option value="">Select a city</option>
            {cityList.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Link */}
      <input type="text" name="link" placeholder="Enter link" value={formData.link} onChange={handleChange} className={activeField === 'link' ? '' : 'hidden-input'} />

      {/* Image Upload */}
      {activeField === 'image' && (
        <div className="upload-container">
          <label className="form-label">Upload Images (max {MAX_IMAGES})</label>
          <input type="file" accept="image/*" multiple onChange={handleFileUpload} />
          {uploading && <p className="uploading-text">Uploading images...</p>}
          <div className="preview-gallery">
            {formData.images.map((img, i) => (
              <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                <img src={img} alt={`Uploaded ${i}`} className="preview-media" />
                <button type="button" onClick={() => handleRemoveImage(i)} style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'red', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', width: '20px', height: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tokens */}
      <input type="number" name="tokens" placeholder="Enter token amount" value={formData.tokens} onChange={handleChange} className={activeField === 'tokens' ? '' : 'hidden-input'} />

      <button type="submit" className="submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default BlogPostForm;
