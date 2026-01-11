import React, { useState, useEffect, useRef } from 'react';
import { db } from '../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './ForumPostForm.css';

const ForumPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    tokens: '',
    location: { city: '', state: '' }
  });
  const [cityInput, setCityInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const autocompleteServiceRef = useRef(null);

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
      tokens: formData.tokens || 0,
      createdAt: Timestamp.now(),
      type: 'forum',
      userId: user.uid,
      likesCounter: 0,
      dislikesCounter: 0,
      likes: [],
      dislikes: []
    };

    try {
      await addDoc(collection(db, 'Posts'), postData);
      setMessage('✅ Forum post added!');
      setSubmitted(true);
    } catch (err) {
      console.error('Firestore error:', err);
      setMessage('❌ Failed to add post.');
    }
  };

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
          src={`${process.env.PUBLIC_URL}/PostCreationIcons/Map-Icon.png`}
          alt="City"
          onClick={() => toggleField('location')}
          className={activeField === 'location' ? 'active' : ''} 
        />
        <img
          src={`${process.env.PUBLIC_URL}/PostCreationIcons/Link-Icon.png`}
          alt="Link"
          onClick={() => toggleField('link')}
          className={activeField === 'link' ? 'active' : ''} 
        />
        <img
          src={`${process.env.PUBLIC_URL}/PostCreationIcons/Token-Icon.png`}
          alt="Tokens"
          onClick={() => toggleField('tokens')}
          className={activeField === 'tokens' ? 'active' : ''} 
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

      {/* Tokens */}
      <input
        type="number"
        name="tokens"
        placeholder="Enter token amount"
        value={formData.tokens}
        onChange={handleChange}
        className={activeField === 'tokens' ? '' : 'hidden-input'}
      />

      <button type="submit" className="submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ForumPostForm;
