import React, { useState, useEffect, useRef } from 'react';
import './TruckPostForm.css';
import { db } from '../../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { CLOUDINARY_CONFIG, GOOGLE_API_KEY } from '../../Components/config';

import AddressToggle from './AddressToggle';
import LinkToggle from './LinkToggle';
import ImageToggle from './ImageToggle';
import TokensToggle from './TokensToggle';
import LoadToggle from './LoadToggle';
import RoutesToggle from './RoutesToggle';

const TruckPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    city: '',
    state: '',
    link: '',
    images: [],
    tokens: 0,
    truckType: '',
    loadWeightMax: '',
    loadLengthMax: '',
    minPerMile: 0,
    dotNumber: '',
  });

  const [originCities, setOriginCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [availableDate, setAvailableDate] = useState('');

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

  const toggleField = (field) => setActiveField(prev => (prev === field ? null : field));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['tokens', 'loadWeightMax', 'loadLengthMax', 'minPerMile'].includes(name) ? Number(value) || 0 : value
    }));
  };

  // ADDRESS HANDLERS
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
    setFormData(prev => ({ ...prev, location: `${city}, ${state}`, city, state }));
    setAddressInput(`${city}, ${state}`);
    setSuggestions([]);
  };

  // ROUTES: ORIGIN
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
    if (originCities.length >= 5) return;
    
    const cityString = `${city}, ${state}`;
    setOriginCities(prev => [...prev, cityString]);
    setOriginInput('');
    setOriginSuggestions([]);
  };

  const removeOrigin = (index) => {
    setOriginCities(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  // ROUTES: DESTINATION
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
    if (destinationCities.length >= 5) return;

    const cityString = `${city}, ${state}`;
    setDestinationCities(prev => [...prev, cityString]);
    setDestinationInput('');
    setDestinationSuggestions([]);
  };

  const removeDestination = (index) => {
    setDestinationCities(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleAvailableDateChange = (e) => setAvailableDate(e.target.value);

  // FILE UPLOAD
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (formData.images.length + files.length > 7) {
      alert('⚠️ You can only upload up to 7 images.');
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls = await Promise.all(files.map(async file => {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('upload_preset', CLOUDINARY_CONFIG.preset);
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`, formDataUpload);
        return res.data.secure_url;
      }));

      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getAuth().currentUser;
    if (!user) return setMessage('❌ You must be signed in to submit a post.');

    try {
      await addDoc(collection(db, 'Posts'), {
        ...formData,
        originCities,
        destinationCities,
        availableDate: availableDate ? Timestamp.fromDate(new Date(availableDate)) : null,
        tokens: formData.tokens || 0,
        createdAt: Timestamp.now(),
        type: 'trucks',
        userId: user.uid,
        likesCounter: 0,
        dislikesCounter: 0,
        likes: [],
        dislikes: [],
      });
      setSubmitted(true);
      setMessage('✅ Truck post added!');
    } catch (err) {
      console.error(err);
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
      <label className="form-label">Title</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} required />

      <label className="form-label">Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      <div className="toggle-buttons-row">
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} alt="Address" onClick={() => toggleField('address')} className={activeField === 'address' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} alt="Link" onClick={() => toggleField('link')} className={activeField === 'link' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} alt="Image" onClick={() => toggleField('image')} className={activeField === 'image' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} alt="Tokens" onClick={() => toggleField('tokens')} className={activeField === 'tokens' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Load-Icon.png`} alt="Load Details" onClick={() => toggleField('load')} className={activeField === 'load' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Routes-Icon.png`} alt="Routes" onClick={() => toggleField('routes')} className={activeField === 'routes' ? 'active' : ''} />
      </div>

      <AddressToggle
        activeField={activeField}
        addressInput={addressInput}
        handleAddressChange={handleAddressChange}
        suggestions={suggestions}
        selectAddress={selectAddress}
      />

      <LinkToggle
        activeField={activeField}
        formData={formData}
        handleChange={handleChange}
      />

      <ImageToggle
        activeField={activeField}
        handleFileUpload={handleFileUpload}
        uploading={uploading}
        images={formData.images}
        handleRemoveImage={handleRemoveImage}
      />

      <TokensToggle
        activeField={activeField}
        formData={formData}
        handleChange={handleChange}
      />

      <LoadToggle
        activeField={activeField}
        formData={formData}
        handleChange={handleChange}
        setFormData={setFormData}
      />

      <RoutesToggle
        activeField={activeField}
        originInput={originInput}
        handleOriginChange={handleOriginChange}
        originSuggestions={originSuggestions}
        selectOrigin={selectOrigin}
        removeOrigin={removeOrigin}
        destinationInput={destinationInput}
        handleDestinationChange={handleDestinationChange}
        destinationSuggestions={destinationSuggestions}
        selectDestination={selectDestination}
        removeDestination={removeDestination}
        originCities={originCities}
        destinationCities={destinationCities}
        availableDate={availableDate}
        handleAvailableDateChange={handleAvailableDateChange}
      />

      <button type="submit" className="submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default TruckPostForm;
