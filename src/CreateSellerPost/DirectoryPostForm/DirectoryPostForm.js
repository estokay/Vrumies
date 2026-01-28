import React, { useState, useEffect, useRef } from 'react';
import './DirectoryPostForm.css';
import { db } from '../../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { CLOUDINARY_CONFIG, GOOGLE_API_KEY } from '../../Components/config';

import PostLocation from './PostLocation';
import PostLink from './PostLink';
import PostImages from './PostImages';
import PostTokens from './PostTokens';
import PostServiceLocation from './PostServiceLocation';
import PostPrice from './PostPrice';

const DirectoryPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    city: '',
    state: '',
    link: '',
    tokens: 0,
    images: [],
    serviceLocation: '',
    businessAddress: '',
    price: '',
  });
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteServiceRef = useRef(null);

  
  const MAX_IMAGES = 7;
  

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

  // Address autocomplete
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationInput(value);

    if (!autocompleteServiceRef.current) return;
    if (!value) return setSuggestions([]);

    const request = {
      input: value,
      types: ['(cities)'],
      componentRestrictions: { country: 'us' },
    };

    autocompleteServiceRef.current.getPlacePredictions(request, (predictions, status) => {
      if (status !== 'OK' || !predictions) return setSuggestions([]);
      setSuggestions(predictions);
    });
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

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (formData.images.length + files.length > MAX_IMAGES) {
      alert(`You can upload up to ${MAX_IMAGES} images.`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('upload_preset', CLOUDINARY_CONFIG.preset);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
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
      type: 'directory',
      userId: user.uid,
      likesCounter: 0,
      dislikesCounter: 0,
      likes: [],
      dislikes: [],
    };

    try {
      await addDoc(collection(db, 'Posts'), postData);
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
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} alt="Location" onClick={() => toggleField('location')} className={activeField === 'location' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} alt="Link" onClick={() => toggleField('link')} className={activeField === 'link' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} alt="Images" onClick={() => toggleField('images')} className={activeField === 'images' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} alt="Tokens" onClick={() => toggleField('tokens')} className={activeField === 'tokens' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/ServiceLocation-Icon.png`} alt="Service Location" onClick={() => toggleField('serviceLocation')} className={activeField === 'serviceLocation' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Price-Icon.png`} alt="Price" onClick={() => toggleField('price')} className={activeField === 'price' ? 'active' : ''} />
      </div>

      {activeField === 'location' && (
        <PostLocation
          formData={formData}
          setFormData={setFormData}
          locationInput={locationInput}
          setLocationInput={setLocationInput}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
          selectLocation={selectLocation}
          handleLocationChange={handleLocationChange}
        />
      )}

      {activeField === 'link' && <PostLink formData={formData} handleChange={handleChange} />}

      {activeField === 'images' && (
        <PostImages
          formData={formData}
          handleFileUpload={handleFileUpload}
          handleRemoveImage={handleRemoveImage}
          uploading={uploading}
          MAX_IMAGES={MAX_IMAGES}
        />
      )}

      {activeField === 'tokens' && <PostTokens formData={formData} handleChange={handleChange} />}

      {activeField === 'serviceLocation' && <PostServiceLocation formData={formData} handleChange={handleChange} />}

      {activeField === 'price' && <PostPrice formData={formData} setFormData={setFormData} />}

      <button type="submit" className="directory-submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default DirectoryPostForm;
