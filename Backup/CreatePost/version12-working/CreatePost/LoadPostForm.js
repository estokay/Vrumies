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

  // === Separate state for first toggle (Post Location) ===
  const [postLocationInput, setPostLocationInput] = useState('');
  const [postLocationSuggestions, setPostLocationSuggestions] = useState([]);

  // === Separate state for Routes toggle ===
  const [pickupInput, setPickupInput] = useState('');
  const [dropoffInput, setDropoffInput] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);

  const autocompleteServiceRef = useRef(null);

  const CLOUDINARY_PRESET = 'vrumies_preset';
  const CLOUDINARY_CLOUD_NAME = 'dmjvngk3o';
  const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY_HERE';

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

  // === Post Location autocomplete handlers (first toggle) ===
  const handlePostLocationChange = (e) => {
    const value = e.target.value;
    setPostLocationInput(value);
    if (!autocompleteServiceRef.current) return;
    if (!value) return setPostLocationSuggestions([]);

    autocompleteServiceRef.current.getPlacePredictions(
      { input: value, types: ['geocode'], componentRestrictions: { country: 'us' } },
      (predictions, status) => {
        if (status !== 'OK' || !predictions) return setPostLocationSuggestions([]);
        setPostLocationSuggestions(predictions);
      }
    );
  };

  const selectPostLocation = (place) => {
    const fullAddress = place.description;
    setFormData((prev) => ({ ...prev, address: fullAddress }));
    setPostLocationInput('');
    setPostLocationSuggestions([]);
  };

  // === Routes autocomplete handlers ===
  const handlePickupChange = (e) => {
    const value = e.target.value;
    setPickupInput(value);
    if (!autocompleteServiceRef.current) return;
    if (!value) return setPickupSuggestions([]);

    autocompleteServiceRef.current.getPlacePredictions(
      { input: value, types: ['geocode'], componentRestrictions: { country: 'us' } },
      (predictions, status) => {
        if (status !== 'OK' || !predictions) return setPickupSuggestions([]);
        setPickupSuggestions(predictions);
      }
    );
  };

  const selectPickup = (place) => {
    const fullAddress = place.description;
    setFormData((prev) => ({
      ...prev,
      pickupLocations: [...prev.pickupLocations, fullAddress],
    }));
    setPickupInput('');
    setPickupSuggestions([]);
  };

  const handleDropoffChange = (e) => {
    const value = e.target.value;
    setDropoffInput(value);
    if (!autocompleteServiceRef.current) return;
    if (!value) return setDropoffSuggestions([]);

    autocompleteServiceRef.current.getPlacePredictions(
      { input: value, types: ['geocode'], componentRestrictions: { country: 'us' } },
      (predictions, status) => {
        if (status !== 'OK' || !predictions) return setDropoffSuggestions([]);
        setDropoffSuggestions(predictions);
      }
    );
  };

  const selectDropoff = (place) => {
    const fullAddress = place.description;
    setFormData((prev) => ({
      ...prev,
      dropoffLocations: [...prev.dropoffLocations, fullAddress],
    }));
    setDropoffInput('');
    setDropoffSuggestions([]);
  };

  // === File upload ===
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
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', CLOUDINARY_PRESET);
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          fd
        );
        return res.data.secure_url;
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    } catch (err) {
      console.error(err);
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
      console.error(err);
      setMessage('❌ Failed to add load post.');
    }
  };

  const publicPath = process.env.PUBLIC_URL;

  return submitted ? (
    <div className="post-success-message">{message}</div>
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
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} alt="Address" onClick={() => toggleField('address')} className={activeField === 'address' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} alt="Link" onClick={() => toggleField('link')} className={activeField === 'link' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} alt="Image" onClick={() => toggleField('image')} className={activeField === 'image' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} alt="Tokens" onClick={() => toggleField('tokens')} className={activeField === 'tokens' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Routes-Icon.png`} alt="Routes" onClick={() => toggleField('routes')} className={activeField === 'routes' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Load-Icon.png`} alt="Load Info" onClick={() => toggleField('load')} className={activeField === 'load' ? 'active' : ''} />
      </div>

      {/* First Toggle: Post Location */}
      {activeField === 'address' && (
        <div>
          <label className="form-label">Post Location (City)</label>
          <input
            type="text"
            value={postLocationInput}
            onChange={handlePostLocationChange}
            placeholder="Enter full address..."
          />
          {postLocationSuggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {postLocationSuggestions.map((s) => (
                <li key={s.place_id} onClick={() => selectPostLocation(s)}>
                  {s.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Routes Toggle */}
      {activeField === 'routes' && (
        <div className="load-details-container">
          <label className="form-label">Pickup Address</label>
          <input
            type="text"
            value={pickupInput}
            onChange={handlePickupChange}
            placeholder="Start Address..."
          />
          {pickupSuggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {pickupSuggestions.map((s) => (
                <li key={s.place_id} onClick={() => selectPickup(s)}>
                  {s.description}
                </li>
              ))}
            </ul>
          )}
          <div>
            {formData.pickupLocations.map((loc, i) => (
              <span key={i} className="chip">{loc}</span>
            ))}
          </div>

          <label className="form-label">Drop-Off Address</label>
          <input
            type="text"
            value={dropoffInput}
            onChange={handleDropoffChange}
            placeholder="Destination Address..."
          />
          {dropoffSuggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {dropoffSuggestions.map((s) => (
                <li key={s.place_id} onClick={() => selectDropoff(s)}>
                  {s.description}
                </li>
              ))}
            </ul>
          )}
          <div>
            {formData.dropoffLocations.map((loc, i) => (
              <span key={i} className="chip">{loc}</span>
            ))}
          </div>

          <label className="form-label">Available Date</label>
          <input
            type="date"
            name="availableDate"
            value={formData.availableDate}
            onChange={handleChange}
          />
        </div>
      )}

      {/* Load Info */}
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

      {/* Link / Image / Tokens toggles */}
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
          <div className="preview-gallery">
            {formData.images.map((img, i) => (
              <img key={i} src={img} alt={`Uploaded ${i}`} className="preview-media" />
            ))}
          </div>
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

export default LoadPostForm;
