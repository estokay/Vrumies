import React, { useState, useEffect, useRef } from 'react';
import './TruckPostForm.css';
import { db } from '../../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { CLOUDINARY_CONFIG, GOOGLE_API_KEY } from '../../Components/config';

const TruckPostForm = () => {
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
    truckType: '',
    loadWeightMax: '',
    loadLengthMax: '',
    minPerMile: '',
    dotNumber: '',
  });

  const [routes, setRoutes] = useState({
    originCities: [],
    destinationCities: [],
    availableDate: '',
  });

  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [addressInput, setAddressInput] = useState('');
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');

  const [suggestions, setSuggestions] = useState([]);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const autocompleteServiceRef = useRef(null);



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
      [name]:
        name === 'tokens' ||
        name === 'loadWeightMax' ||
        name === 'loadLengthMax' ||
        name === 'minPerMile'
          ? Number(value) || 0
          : value,
    }));
  };

  // Address autocomplete
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddressInput(value);
    if (!autocompleteServiceRef.current || !value) return setSuggestions([]);

    autocompleteServiceRef.current.getPlacePredictions(
      { input: value, types: ['(cities)'], componentRestrictions: { country: 'us' } },
      (predictions, status) => {
        if (status !== 'OK' || !predictions) return setSuggestions([]);
        setSuggestions(predictions);
      }
    );
  };

  const selectAddress = (place) => {
    const city = place.terms[0]?.value || '';
    const state = place.terms[1]?.value || '';
    const fullAddress = `${city}, ${state}`;
    setFormData((prev) => ({ ...prev, address: fullAddress, city, state }));
    setAddressInput('');
    setSuggestions([]);
  };

  // Routes: Origin
  const handleOriginChange = (e) => {
    const value = e.target.value;
    setOriginInput(value);
    if (!autocompleteServiceRef.current || !value) return setOriginSuggestions([]);

    autocompleteServiceRef.current.getPlacePredictions(
      { input: value, types: ['(cities)'], componentRestrictions: { country: 'us' } },
      (predictions, status) => {
        if (status !== 'OK' || !predictions) return setOriginSuggestions([]);
        setOriginSuggestions(predictions);
      }
    );
  };

  const selectOrigin = (place) => {
    const city = place.terms[0]?.value || '';
    const state = place.terms[1]?.value || '';
    if (routes.originCities.length >= 5) return;
    setRoutes((prev) => ({
      ...prev,
      originCities: [...prev.originCities, { city, state }],
    }));
    setOriginInput('');
    setOriginSuggestions([]);
  };

  const removeOrigin = (index) => {
    setRoutes((prev) => {
      const updated = [...prev.originCities];
      updated.splice(index, 1);
      return { ...prev, originCities: updated };
    });
  };

  // Routes: Destination
  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestinationInput(value);
    if (!autocompleteServiceRef.current || !value) return setDestinationSuggestions([]);

    autocompleteServiceRef.current.getPlacePredictions(
      { input: value, types: ['(cities)'], componentRestrictions: { country: 'us' } },
      (predictions, status) => {
        if (status !== 'OK' || !predictions) return setDestinationSuggestions([]);
        setDestinationSuggestions(predictions);
      }
    );
  };

  const selectDestination = (place) => {
    const city = place.terms[0]?.value || '';
    const state = place.terms[1]?.value || '';
    if (routes.destinationCities.length >= 5) return;
    setRoutes((prev) => ({
      ...prev,
      destinationCities: [...prev.destinationCities, { city, state }],
    }));
    setDestinationInput('');
    setDestinationSuggestions([]);
  };

  const removeDestination = (index) => {
    setRoutes((prev) => {
      const updated = [...prev.destinationCities];
      updated.splice(index, 1);
      return { ...prev, destinationCities: updated };
    });
  };

  const handleAvailableDateChange = (e) => {
    setRoutes((prev) => ({ ...prev, availableDate: e.target.value }));
  };

  // File upload
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

  // Submit
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
      routes,
      tokens: formData.tokens || 0,
      createdAt: Timestamp.now(),
      type: 'trucks',
      userId: user.uid,
      likesCounter: 0,
      dislikesCounter: 0,
      likes: [],
      dislikes: [],
    };

    try {
      await addDoc(collection(db, 'Posts'), postData);
      setMessage('✅ Truck post added!');
      setSubmitted(true);
    } catch (err) {
      console.error('Firestore error:', err);
      setMessage('❌ Failed to add truck post.');
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
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} alt="Address" onClick={() => toggleField('address')} className={activeField === 'address' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} alt="Link" onClick={() => toggleField('link')} className={activeField === 'link' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} alt="Image" onClick={() => toggleField('image')} className={activeField === 'image' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} alt="Tokens" onClick={() => toggleField('tokens')} className={activeField === 'tokens' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Load-Icon.png`} alt="Load Details" onClick={() => toggleField('load')} className={activeField === 'load' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Routes-Icon.png`} alt="Routes" onClick={() => toggleField('routes')} className={activeField === 'routes' ? 'active' : ''} />
      </div>

      {/* Address */}
      {activeField === 'address' && (
        <div>
          <label className="form-label">Post Location (City)</label>
          <input type="text" value={addressInput} onChange={handleAddressChange} placeholder="Type a city..." required />
          {suggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {suggestions.map((s) => (
                <li key={s.place_id} onClick={() => selectAddress(s)}>
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

      {/* Image Upload */}
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

      {/* Tokens */}
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

      {/* Load Section */}
      {activeField === 'load' && (
        <div className="load-details-container">
          <label className="form-label">Truck Type</label>
          <select name="truckType" value={formData.truckType} onChange={handleChange} required>
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

          <label className="form-label">Load Weight Max Limit (Ibs)</label>
          <input type="number" name="loadWeightMax" value={formData.loadWeightMax} onChange={handleChange} placeholder="e.g. 42000" />

          <label className="form-label">Load Length Max Limit (ft)</label>
          <input type="number" name="loadLengthMax" value={formData.loadLengthMax} onChange={handleChange} placeholder="e.g. 53" />

          <label className="form-label">Minimum Per Mile Charge ($)</label>
          <div className="load-price-wrapper">
            <input
              type="number"
              name="minPerMile"
              value={formData.minPerMile}
              onChange={handleChange}
              placeholder="e.g. 2.50"
              step="0.01"
            />
          </div>

          <label className="form-label">DOT# (Optional)</label>
          <input type="text" name="dotNumber" value={formData.dotNumber} onChange={handleChange} placeholder="Enter DOT Number" />
        </div>
      )}

      {/* Routes Section */}
      {activeField === 'routes' && (
        <div className="routes-container">
          <label className="form-label">Origin (Start City) - max 5</label>
          <input type="text" value={originInput} onChange={handleOriginChange} placeholder="Type a city..." />
          {originSuggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {originSuggestions.map((s) => (
                <li key={s.place_id} onClick={() => selectOrigin(s)}>
                  {s.structured_formatting.main_text}, {s.structured_formatting.secondary_text}
                </li>
              ))}
            </ul>
          )}
          <div className="chips-container">
            {routes.originCities.map((c, i) => (
              <div key={i} className="chip">
                {c.city}, {c.state}
                <span className="chip-close" onClick={() => removeOrigin(i)}>×</span>
              </div>
            ))}
          </div>

          <label className="form-label">Destination (End City) - max 5</label>
          <input type="text" value={destinationInput} onChange={handleDestinationChange} placeholder="Type a city..." />
          {destinationSuggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {destinationSuggestions.map((s) => (
                <li key={s.place_id} onClick={() => selectDestination(s)}>
                  {s.structured_formatting.main_text}, {s.structured_formatting.secondary_text}
                </li>
              ))}
            </ul>
          )}
          <div className="chips-container">
            {routes.destinationCities.map((c, i) => (
              <div key={i} className="chip">
                {c.city}, {c.state}
                <span className="chip-close" onClick={() => removeDestination(i)}>×</span>
              </div>
            ))}
          </div>

          <label className="form-label">Available Date</label>
          <input type="date" value={routes.availableDate} onChange={handleAvailableDateChange} />
        </div>
      )}

      <button type="submit" className="submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default TruckPostForm;
