import React, { useState, useEffect, useRef } from 'react';
import './RequestPostForm.css';

import { db } from '../../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

import { CLOUDINARY_CONFIG, GOOGLE_API_KEY } from '../../Components/config';

import LocationField from './LocationField';
import LinkField from './LinkField';
import ImageUploadField from './ImageUploadField';
import TokensField from './TokensField';
import UrgencyField from './UrgencyField';

const RequestPostForm = () => {
  const [activeField, setActiveField] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    location: '',
    link: '',
    tokens: 0,
    urgency: 'I Can Wait'
  });

  const [cityInput, setCityInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const autocompleteServiceRef = useRef(null);

  const MAX_IMAGES = 7;

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        autocompleteServiceRef.current =
          new window.google.maps.places.AutocompleteService();
      };
      document.body.appendChild(script);
    } else {
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService();
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

    autocompleteServiceRef.current.getPlacePredictions(
      request,
      (predictions, status) => {
        if (status !== 'OK' || !predictions) {
          setSuggestions([]);
          return;
        }
        setSuggestions(predictions);
      }
    );
  };

  const selectCity = (place) => {
    const city = place.terms[0]?.value || '';
    const state = place.terms[1]?.value || '';
    const location = `${city}, ${state}`;

    setFormData((prev) => ({
      ...prev,
      location,
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
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', CLOUDINARY_CONFIG.preset);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
          fd
        );

        return res.data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (err) {
      console.error(err);
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
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
      createdAt: Timestamp.now(),
      type: 'request',
      userId: user.uid,
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
      console.error(err);
      setMessage('❌ Failed to add post.');
    }
  };

  const publicPath = process.env.PUBLIC_URL;

  if (submitted) {
    return (
      <div className="post-success-message">
        <p>{message}</p>
      </div>
    );
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <label className="form-label">Title</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label className="form-label">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      {/* Toggle bar (UNCHANGED) */}
      <div className="toggle-buttons-row">
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} onClick={() => toggleField('location')} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} onClick={() => toggleField('link')} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} onClick={() => toggleField('image')} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} onClick={() => toggleField('tokens')} />
        <img src={`${publicPath}/PostCreationIcons/Urgency-Icon.png`} onClick={() => toggleField('urgency')} />
      </div>

      {activeField === 'location' && (
        <LocationField
          cityInput={cityInput}
          handleCityChange={handleCityChange}
          suggestions={suggestions}
          selectCity={selectCity}
        />
      )}

      {activeField === 'link' && (
        <LinkField
          link={formData.link}
          handleChange={handleChange}
        />
      )}

      {activeField === 'image' && (
        <ImageUploadField
          images={formData.images}
          uploading={uploading}
          MAX_IMAGES={MAX_IMAGES}
          handleFileUpload={handleFileUpload}
          handleRemoveImage={handleRemoveImage}
        />
      )}

      {activeField === 'tokens' && (
        <TokensField
          tokens={formData.tokens}
          handleChange={handleChange}
        />
      )}

      {activeField === 'urgency' && (
        <UrgencyField
          urgency={formData.urgency}
          handleChange={handleChange}
        />
      )}

      <button type="submit" className="submit-btn">
        Submit
      </button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default RequestPostForm;
