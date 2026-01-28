import React, { useState, useEffect, useRef } from 'react';
import './BlogPostForm.css';
import { db } from '../../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { CLOUDINARY_CONFIG, GOOGLE_API_KEY } from '../../Components/config';

import BlogPostLocation from './BlogPostLocation';
import BlogPostLink from './BlogPostLink';
import BlogPostImages from './BlogPostImages';
import BlogPostTokens from './BlogPostTokens';

const BlogPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const [cityInput, setCityInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteServiceRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    tokens: 0,
    images: [],
    location: '',
  });

  // Load Google Places
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
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tokens' ? Number(value) || 0 : value
    }));
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCityInput(value);

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

  const selectCity = (place) => {
    const city = place.terms[0]?.value || '';
    const state = place.terms[1]?.value || '';
    const location = `${city}, ${state}`;

    setFormData(prev => ({
      ...prev,
      location,
    }));

    setCityInput(`${city}, ${state}`);
    setSuggestions([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getAuth().currentUser;

    if (!user) {
      setMessage('❌ You must be signed in to submit a post.');
      return;
    }

    await addDoc(collection(db, 'Posts'), {
      ...formData,
      createdAt: Timestamp.now(),
      type: 'blog',
      userId: user.uid,
      likesCounter: 0,
      dislikesCounter: 0,
      likes: [],
      dislikes: []
    });

    setSubmitted(true);
    setMessage('✅ Blog post added!');
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
      <input name="title" value={formData.title} onChange={handleChange} required />

      <label className="form-label">Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      {/* TOGGLE BAR (STAYS HERE) */}
      <div className="toggle-buttons-row">
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} onClick={() => toggleField('location')} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} onClick={() => toggleField('link')} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} onClick={() => toggleField('image')} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} onClick={() => toggleField('tokens')} />
      </div>

      {/* TOGGLE CONTENT */}
      {activeField === 'location' && (
        <BlogPostLocation
          cityInput={cityInput}
          suggestions={suggestions}
          onCityChange={handleCityChange}
          onSelectCity={selectCity}
        />
      )}

      {activeField === 'link' && (
        <BlogPostLink
          value={formData.link}
          onChange={handleChange}
        />
      )}

      {activeField === 'image' && (
        <BlogPostImages
          images={formData.images}
          uploading={uploading}
          onUpload={handleFileUpload}
        />
      )}

      {activeField === 'tokens' && (
        <BlogPostTokens
          value={formData.tokens}
          onChange={handleChange}
        />
      )}

      <button type="submit" className="submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default BlogPostForm;
