import React, { useState, useEffect, useRef } from 'react';
import './RequestPostForm.css';
import { db } from '../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import axios from 'axios';

const RequestPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    location: { city: '', state: '' },
    link: '',
    tokens: '',
    urgency: 'I Can Wait',
  });
  const [cityInput, setCityInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const autocompleteServiceRef = useRef(null);

  const CLOUDINARY_PRESET = 'vrumies_preset';
  const CLOUDINARY_CLOUD_NAME = 'dmjvngk3o';
  const MAX_IMAGES = 7;
  const GOOGLE_API_KEY = 'AIzaSyAF-Y9M2YTMmMBu6RU7sDh4vRM9gFdC5MI';

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      };
      document.body.appendChild(script);
    } else {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  const toggleField = (field) => {
    setActiveField((prev) => (prev === field ? null : field));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tokens' ? Number(value) || 0 : value
    }));
  };

  // City autocomplete
  const handleCityChange = (e) => {
    const value = e.target.value;
    setCityInput(value);

    if (!autocompleteServiceRef.current || !value) {
      setSuggestions([]);
      return;
    }

    const request = {
      input: value,
      types: ['(cities)'],
      componentRestrictions: { country: 'us' }
    };

    autocompleteServiceRef.current.getPlacePredictions(request, (predictions, status) => {
      if (status !== 'OK' || !predictions) return setSuggestions([]);
      setSuggestions(predictions);
    });
  };

  const selectCity = (place) => {
    const terms = place.terms;
    const city = terms[0].value || '';
    const state = terms[1]?.value || '';
    setFormData((prev) => ({
      ...prev,
      location: { city, state }
    }));
    setCityInput(`${city}, ${state}`);
    setSuggestions([]);
  };

  // Image upload
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (formData.images.length + files.length > MAX_IMAGES) {
      alert(`⚠️ You can only upload up to ${MAX_IMAGES} images per post.`);
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

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      ...formData,
      tokens: formData.tokens || 0,
      createdAt: Timestamp.now(),
      type: 'request',
      likesCounter: 0,
      dislikesCounter: 0,
      likes: [],
      dislikes: []
    };

    try {
      await addDoc(collection(db, 'Posts'), postData);
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
          alt="Location"
          onClick={() => toggleField('location')}
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

      {/* Location input with autocomplete */}
      {activeField === 'location' && (
        <div>
          <label className="form-label">City</label>
          <input
            type="text"
            value={cityInput}
            onChange={handleCityChange}
            placeholder="Type a city..."
            required
          />
          {suggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {suggestions.map((s) => (
                <li key={s.place_id} onClick={() => selectCity(s)}>
                  {s.structured_formatting.main_text}, {s.structured_formatting.secondary_text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

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
          <label className="form-label">Upload Images (max {MAX_IMAGES})</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
          />
          {uploading && <p className="uploading-text">Uploading images...</p>}
          <div className="preview-gallery">
            {formData.images.map((img, i) => (
              <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                <img src={img} alt={`Uploaded ${i}`} className="preview-media" />
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
                    justifyContent: 'center',
                  }}
                >
                  ✖
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
