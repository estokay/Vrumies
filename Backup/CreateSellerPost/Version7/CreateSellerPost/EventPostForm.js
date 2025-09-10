import React, { useState, useEffect, useRef } from 'react';
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
    location: '',
    city: '',
    state: '',
    link: '',
    tokens: '',
    eventDateTime: '',
    price: '',
  });
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteServiceRef = useRef(null);

  const CLOUDINARY_PRESET = 'vrumies_preset';
  const CLOUDINARY_CLOUD_NAME = 'dmjvngk3o';
  const MAX_IMAGES = 7;
  const GOOGLE_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY'; // Replace with your API key

  // Load Google Places API
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
      [name]: name === 'tokens' ? Number(value) || 0 : value,
    }));
  };

  // Location autocomplete
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationInput(value);

    if (!autocompleteServiceRef.current || !value) {
      setSuggestions([]);
      return;
    }

    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: value,
        types: ['(cities)'],
        componentRestrictions: { country: 'us' },
      },
      (predictions, status) => {
        if (status !== 'OK' || !predictions) {
          setSuggestions([]);
          return;
        }
        setSuggestions(predictions);
      }
    );
  };

  const selectLocation = (place) => {
    const terms = place.terms;
    const city = terms[0]?.value || '';
    const state = terms[1]?.value || '';
    const fullAddress = `${city}, ${state}`;

    setFormData((prev) => ({
      ...prev,
      location: fullAddress,
      city,
      state,
    }));
    setLocationInput(fullAddress);
    setSuggestions([]);
  };

  // ✅ Image upload
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (formData.images.length + files.length > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed.`);
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

    const postData = {
      ...formData,
      tokens: formData.tokens || 0,
      eventDateTime: formData.eventDateTime
        ? Timestamp.fromDate(new Date(formData.eventDateTime))
        : null,
      createdAt: Timestamp.now(),
      type: 'event',
      userId: user.uid,
      likesCounter: 0,
      dislikesCounter: 0,
      likes: [],
      dislikes: [],
    };

    try {
      await addDoc(collection(db, 'Posts'), postData);
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
      <label className="event-form-label">Title</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} required />

      <label className="event-form-label">Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      <div className="event-toggle-buttons-row">
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} alt="Location" onClick={() => toggleField('location')} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} alt="Link" onClick={() => toggleField('link')} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} alt="Image" onClick={() => toggleField('images')} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} alt="Tokens" onClick={() => toggleField('tokens')} />
        <img src={`${publicPath}/PostCreationIcons/Calendar-Icon.png`} alt="Calendar" onClick={() => toggleField('eventDateTime')} />
        <img src={`${publicPath}/PostCreationIcons/Price-Icon.png`} alt="Price" onClick={() => toggleField('price')} />
      </div>

      {/* Location with autocomplete */}
      {activeField === 'location' && (
        <div className="autocomplete-wrapper">
          <input
            type="text"
            placeholder="Type a city..."
            value={locationInput}
            onChange={handleLocationChange}
            required
          />
          {suggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {suggestions.map((s) => (
                <li key={s.place_id} onClick={() => selectLocation(s)}>
                  {s.structured_formatting.main_text}, {s.structured_formatting.secondary_text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <input
        type="text"
        name="link"
        placeholder="Enter link"
        value={formData.link}
        onChange={handleChange}
        className={activeField === 'link' ? '' : 'event-hidden-input'}
      />

      {/* Multiple image upload */}
      {activeField === 'images' && (
        <div className="event-upload-container">
          <label className="event-form-label">Upload Images (max {MAX_IMAGES})</label>
          <input type="file" accept="image/*" multiple onChange={handleFileUpload} />
          {uploading && <p className="event-uploading-text">Uploading images...</p>}
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

      <input type="number" name="tokens" placeholder="Enter token amount" value={formData.tokens} onChange={handleChange} className={activeField === 'tokens' ? '' : 'event-hidden-input'} />

      {activeField === 'eventDateTime' && (
        <input type="datetime-local" name="eventDateTime" value={formData.eventDateTime} onChange={handleChange} className="event-datetime-input" />
      )}

      {activeField === 'price' && (
        <input type="text" name="price" placeholder="$0.00" value={formData.price || ''} onChange={(e) => {
          let value = e.target.value.replace(/[^0-9.]/g, '');
          const floatVal = parseFloat(value);
          value = !isNaN(floatVal) ? `$${floatVal.toFixed(2)}` : '$0.00';
          setFormData((prev) => ({ ...prev, price: value }));
        }} className="event-datetime-input" />
      )}

      <button type="submit" className="event-submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default EventPostForm;
