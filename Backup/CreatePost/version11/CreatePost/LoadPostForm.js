import React, { useState, useEffect, useRef } from 'react';
import './LoadPostForm.css';
import { db } from '../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

const LoadPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    link: '',
    images: [],
    tokens: 0,
    // Routes
    pickupLocations: [],
    dropoffLocations: [],
    availableDate: '',
    // Load Info
    truckType: '',
    loadWeight: '',
    loadLength: '',
    payout: '',
  });
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [addressInput, setAddressInput] = useState('');
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
      [name]: ['tokens', 'loadWeight', 'loadLength', 'payout'].includes(name)
        ? Number(value) || 0
        : value,
    }));
  };

  // Address autocomplete handler
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddressInput(value);
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

  const selectAddress = (place, type) => {
    const terms = place.terms;
    const city = terms[0]?.value || '';
    const state = terms[1]?.value || '';
    const fullAddress = `${city}, ${state}`;

    if (type === 'pickup') {
      setFormData((prev) => ({
        ...prev,
        pickupLocations: [...prev.pickupLocations, { city, state, fullAddress }],
      }));
    } else if (type === 'dropoff') {
      setFormData((prev) => ({
        ...prev,
        dropoffLocations: [...prev.dropoffLocations, { city, state, fullAddress }],
      }));
    }

    setAddressInput('');
    setSuggestions([]);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (formData.images.length + files.length > 7) {
      alert('⚠️ You can only upload up to 7 images.');
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
      type: 'loads',
      userId: user.uid,
      likesCounter: 0,
      dislikesCounter: 0,
      likes: [],
      dislikes: [],
    };

    try {
      await addDoc(collection(db, 'Posts'), postData);
      setMessage('✅ Load post added!');
      setSubmitted(true);
    } catch (err) {
      console.error('Firestore error:', err);
      setMessage('❌ Failed to add load post.');
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
      <input type="text" name="title" value={formData.title} onChange={handleChange} required />

      {/* Description */}
      <label className="form-label">Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      {/* Toggle Buttons */}
      <div className="toggle-buttons-row">
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} alt="Address" onClick={() => toggleField('address')} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} alt="Link" onClick={() => toggleField('link')} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} alt="Image" onClick={() => toggleField('image')} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} alt="Tokens" onClick={() => toggleField('tokens')} />
        <img src={`${publicPath}/PostCreationIcons/Routes-Icon.png`} alt="Routes" onClick={() => toggleField('routes')} />
        <img src={`${publicPath}/PostCreationIcons/Load-Icon.png`} alt="Load Info" onClick={() => toggleField('load')} />
      </div>

      {/* Routes Section */}
      {activeField === 'routes' && (
        <div className="load-details-container">
          <label className="form-label">Pickup Location</label>
          <input type="text" value={addressInput} onChange={handleAddressChange} placeholder="Start city..." />
          {suggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {suggestions.map((s) => (
                <li key={s.place_id} onClick={() => selectAddress(s, 'pickup')}>
                  {s.structured_formatting.main_text}, {s.structured_formatting.secondary_text}
                </li>
              ))}
            </ul>
          )}
          <div>
            {formData.pickupLocations.map((loc, i) => (
              <span key={i} className="chip">{loc.fullAddress}</span>
            ))}
          </div>

          <label className="form-label">Drop-Off Location</label>
          <input type="text" value={addressInput} onChange={handleAddressChange} placeholder="Destination city..." />
          {suggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {suggestions.map((s) => (
                <li key={s.place_id} onClick={() => selectAddress(s, 'dropoff')}>
                  {s.structured_formatting.main_text}, {s.structured_formatting.secondary_text}
                </li>
              ))}
            </ul>
          )}
          <div>
            {formData.dropoffLocations.map((loc, i) => (
              <span key={i} className="chip">{loc.fullAddress}</span>
            ))}
          </div>

          <label className="form-label">Available Date</label>
          <input type="date" name="availableDate" value={formData.availableDate} onChange={handleChange} />
        </div>
      )}

      {/* Load Info Section */}
      {activeField === 'load' && (
        <div className="load-details-container">
          <label className="form-label">Truck Type</label>
          <select name="truckType" value={formData.truckType} onChange={handleChange}>
            <option value="">Select truck type</option>
            <option value="Refrigerated Semi-Truck (Reefer)">Refrigerated Semi-Truck (Reefer)</option>
            <option value="Hot Shot">Hot Shot</option>
            <option value="Box Truck">Box Truck</option>
            <option value="Flat Bed">Flat Bed</option>
            <option value="Regular Semi Truck (Dry Van)">Regular Semi Truck (Dry Van)</option>
            <option value="Power Only">Power Only</option>
            <option value="Car Carrier Trailer">Car Carrier Trailer</option>
            <option value="Other">Other</option>
          </select>

          <label className="form-label">Load Weight (Pounds)</label>
          <input type="number" name="loadWeight" value={formData.loadWeight} onChange={handleChange} />

          <label className="form-label">Load Length (ft)</label>
          <input type="number" name="loadLength" value={formData.loadLength} onChange={handleChange} />

          <label className="form-label">Payout ($)</label>
          <div className="load-price-wrapper">
            <input type="number" name="payout" value={formData.payout} onChange={handleChange} step="0.01" />
          </div>
        </div>
      )}

      <button type="submit" className="submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default LoadPostForm;
