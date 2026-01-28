import React, { useState, useEffect, useRef } from 'react';
import './EventPostForm.css';
import { db } from '../../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { CLOUDINARY_CONFIG, GOOGLE_API_KEY } from '../../Components/config';

import EventLocationToggle from './EventLocationToggle';
import EventLinkToggle from './EventLinkToggle';
import EventImagesToggle from './EventImagesToggle';
import EventTokensToggle from './EventTokensToggle';
import EventInfoToggle from './EventInfoToggle';

const EventPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteServiceRef = useRef(null);

  const MAX_IMAGES = 7;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    location: '',
    city: '',
    state: '',
    link: '',
    tokens: '',
    eventAddress: '',
    eventDateTime: null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  // Google Places
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
    setActiveField(prev => (prev === field ? null : field));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'eventDateTime' || name === 'timezone') {
        return { ...prev, [name]: value };
      }
      return { ...prev, [name]: name === 'tokens' ? Number(value) || 0 : value };
    });
  };

  // Location
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
        componentRestrictions: { country: 'us' }
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
    const city = place.terms[0]?.value || '';
    const state = place.terms[1]?.value || '';
    const full = `${city}, ${state}`;

    setFormData(prev => ({
      ...prev,
      location: full,
      city,
      state
    }));

    setLocationInput(full);
    setSuggestions([]);
  };

  // Images
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (formData.images.length + files.length > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    setUploading(true);

    try {
      const uploads = files.map(file => {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', CLOUDINARY_CONFIG.preset);

        return axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
          fd
        );
      });

      const results = await Promise.all(uploads);
      const urls = results.map(r => r.data.secure_url);

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getAuth().currentUser;

    if (!user) {
      setMessage('❌ You must be signed in to submit a post.');
      return;
    }

    await addDoc(collection(db, 'Posts'), {
      ...formData,
      tokens: formData.tokens || 0,
      eventDateTime: formData.eventDateTime ?? null,
      createdAt: Timestamp.now(),
      type: 'event',
      userId: user.uid,
      likesCounter: 0,
      dislikesCounter: 0,
      likes: [],
      dislikes: []
    });

    setSubmitted(true);
    setMessage('✅ Event post added!');
  };

  const publicPath = process.env.PUBLIC_URL;

  if (submitted) {
    return (
      <div className="event-success-message">
        <p>{message}</p>
      </div>
    );
  }

  return (
    <form className="event-post-form" onSubmit={handleSubmit}>
      <label className="event-form-label">Title</label>
      <input name="title" value={formData.title} onChange={handleChange} required />

      <label className="event-form-label">Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      {/* TOGGLE BAR (NOT COMPONENTIZED) */}
      <div className="event-toggle-buttons-row">
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} onClick={() => toggleField('location')} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} onClick={() => toggleField('link')} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} onClick={() => toggleField('images')} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} onClick={() => toggleField('tokens')} />
        <img src={`${publicPath}/PostCreationIcons/Calendar-Icon.png`} onClick={() => toggleField('eventInfo')} />
      </div>

      {/* TOGGLE CONTENT */}
      {activeField === 'location' && (
        <EventLocationToggle
          locationInput={locationInput}
          suggestions={suggestions}
          onChange={handleLocationChange}
          onSelect={selectLocation}
        />
      )}

      {activeField === 'link' && (
        <EventLinkToggle
          value={formData.link}
          onChange={handleChange}
        />
      )}

      {activeField === 'images' && (
        <EventImagesToggle
          images={formData.images}
          uploading={uploading}
          maxImages={MAX_IMAGES}
          onUpload={handleFileUpload}
          onRemove={removeImage}
        />
      )}

      {activeField === 'tokens' && (
        <EventTokensToggle
          value={formData.tokens}
          onChange={handleChange}
        />
      )}

      {activeField === 'eventInfo' && (
        <EventInfoToggle
          eventAddress={formData.eventAddress}
          eventDateTime={formData.eventDateTime}
          timezone={formData.timezone}
          onChange={handleChange}
        />
      )}

      <button type="submit" className="event-submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default EventPostForm;
