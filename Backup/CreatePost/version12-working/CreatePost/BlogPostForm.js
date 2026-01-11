import React, { useState, useEffect, useRef } from 'react';
import './BlogPostForm.css';
import { db } from '../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

const BlogPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    tokens: '',
    images: [],
    location: { city: '', state: '' }
  });
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteServiceRef = useRef(null);

  const CLOUDINARY_PRESET = 'vrumies_preset';
  const CLOUDINARY_CLOUD_NAME = 'dmjvngk3o';
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

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCityInput(value);

    if (!autocompleteServiceRef.current) return;
    if (!value) return setSuggestions([]);

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
    // Extract city and state from place terms
    const terms = place.terms;
    let city = terms[0].value || '';
    let state = terms[1]?.value || '';
    setFormData((prev) => ({
      ...prev,
      location: { city, state }
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
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
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
      title: formData.title || '',
      description: formData.description || '',
      location: formData.location || { city: '', state: '' },
      link: formData.link || '',
      images: formData.images || [],
      tokens: formData.tokens || 0,
      createdAt: Timestamp.now(),
      type: 'blog',
      userId: user.uid,
      likesCounter: 0,
      dislikesCounter: 0,
      likes: [],
      dislikes: []
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

  const publicPath = process.env.PUBLIC_URL;

  return submitted ? (
    <div className="post-success-message">
      <p>{message}</p>
    </div>
  ) : (
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

      <div className="toggle-buttons-row">
        <img
          src={`${publicPath}/PostCreationIcons/Map-Icon.png`}
          alt="City"
          onClick={() => toggleField('location')}
          className={activeField === 'location' ? 'active' : ''}
        />
        <img
          src={`${publicPath}/PostCreationIcons/Link-Icon.png`}
          alt="Link"
          onClick={() => toggleField('link')}
          className={activeField === 'link' ? 'active' : ''}
        />
        <img
          src={`${publicPath}/PostCreationIcons/Image-Icon.png`}
          alt="Image"
          onClick={() => toggleField('image')}
          className={activeField === 'image' ? 'active' : ''}
        />
        <img
          src={`${publicPath}/PostCreationIcons/Token-Icon.png`}
          alt="Tokens"
          onClick={() => toggleField('tokens')}
          className={activeField === 'tokens' ? 'active' : ''}
        />
      </div>

      {activeField === 'location' && (
        <div>
          <label className="form-label">Post Location (City)</label>
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

      {activeField === 'link' && (
          <div>
            <label className="form-label">Website Link</label>
            <input
              type="text"
              name="link"
              placeholder="Enter link"
              value={formData.link}
              onChange={handleChange}
            />
          </div>
        )}

      {activeField === 'image' && (
        <div className="upload-container">
          <label className="form-label">Upload Images (max 7)</label>
          <input type="file" accept="image/*" multiple onChange={handleFileUpload} />
          {uploading && <p className="uploading-text">Uploading images...</p>}
          {formData.images.length > 0 && (
            <div className="preview-gallery">
              {formData.images.map((img, i) => (
                <img key={i} src={img} alt={`Uploaded ${i}`} className="preview-media" />
              ))}
            </div>
          )}
        </div>
      )}

      {activeField === 'tokens' && (
          <div>
            <label className="form-label">Token Amount</label>
            <input
              type="number"
              name="tokens"
              placeholder="Enter token amount"
              value={formData.tokens}
              onChange={handleChange}
            />
          </div>
        )}

      <button type="submit" className="submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default BlogPostForm;
