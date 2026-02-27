import React, { useState, useEffect, useRef } from 'react';
import './LoadPostForm.css';

import { db } from '../../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { CLOUDINARY_CONFIG, GOOGLE_API_KEY } from '../../Components/config';

// Toggle components
import PostLocationToggle from './PostLocationToggle';
import RoutesToggle from './RoutesToggle';
import LoadInfoToggle from './LoadInfoToggle';
import LinkToggle from './LinkToggle';
import ImageToggle from './ImageToggle';
import TokensToggle from './TokensToggle';

const LoadPostForm = () => {
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

    pickupAddress: [],
    dropoffAddress: [],
    availableDate: '',

    truckType: '',
    loadWeight: '',
    loadLength: '',
    payout: '',
  });

  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Post location autocomplete
  const [postLocationInput, setPostLocationInput] = useState('');
  const [postLocationSuggestions, setPostLocationSuggestions] = useState([]);

  // Routes autocomplete
  const [pickupInput, setPickupInput] = useState('');
  const [dropoffInput, setDropoffInput] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);



  const autocompleteServiceRef = useRef(null);

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
      [name]: ['tokens', 'loadWeight', 'loadLength', 'payout'].includes(name)
        ? Number(value) || 0
        : value,
    }));
  };

  // ================= Post Location =================
  const handlePostLocationChange = (e) => {
    const value = e.target.value;
    setPostLocationInput(value);

    if (!autocompleteServiceRef.current || !value) {
      setPostLocationSuggestions([]);
      return;
    }

    autocompleteServiceRef.current.getPlacePredictions(
      { input: value, types: ['geocode'], componentRestrictions: { country: 'us' } },
      (predictions, status) => {
        if (status !== 'OK' || !predictions) {
          setPostLocationSuggestions([]);
          return;
        }
        setPostLocationSuggestions(predictions);
      }
    );
  };

  const selectPostLocation = (place) => {
    setFormData(prev => ({ ...prev, location: place.description }));
    setPostLocationInput(place.description);
    setPostLocationSuggestions([]);
  };

  // ================= Routes =================
  const handlePickupChange = (e) => {
    const value = e.target.value;
    setPickupInput(value);

    if (!autocompleteServiceRef.current || !value) {
      setPickupSuggestions([]);
      return;
    }

    autocompleteServiceRef.current.getPlacePredictions(
      { input: value, types: ['address'], componentRestrictions: { country: 'us' } },
      (predictions, status) => {
        if (status !== 'OK' || !predictions) {
          setPickupSuggestions([]);
          return;
        }
        setPickupSuggestions(predictions);
      }
    );
  };

  const selectPickup = (place) => {
    setFormData(prev => ({
      ...prev,
      pickupAddress: [place.description],
    }));
    setPickupInput('');
    setPickupSuggestions([]);
  };

  const removePickup = () => {
    setFormData(prev => ({ ...prev, pickupAddress: [] }));
  };

  const handleDropoffChange = (e) => {
    const value = e.target.value;
    setDropoffInput(value);

    if (!autocompleteServiceRef.current || !value) {
      setDropoffSuggestions([]);
      return;
    }

    autocompleteServiceRef.current.getPlacePredictions(
      { input: value, types: ['address'], componentRestrictions: { country: 'us' } },
      (predictions, status) => {
        if (status !== 'OK' || !predictions) {
          setDropoffSuggestions([]);
          return;
        }
        setDropoffSuggestions(predictions);
      }
    );
  };

  const selectDropoff = (place) => {
    setFormData(prev => ({
      ...prev,
      dropoffAddress: [place.description],
    }));
    setDropoffInput('');
    setDropoffSuggestions([]);
  };
  
  const removeDropoff = () => {
    setFormData(prev => ({ ...prev, dropoffAddress: [] }));
  };

  // ================= Image Upload =================
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (formData.images.length + files.length > 7) {
      alert('Max 7 images allowed');
      return;
    }

    setUploading(true);
    try {
      const uploads = files.map(async file => {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', CLOUDINARY_CONFIG.preset);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
          fd
        );

        return res.data.secure_url;
      });

      const urls = await Promise.all(uploads);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      console.error(err);
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getCityStateFromAddress = async (address) => {
    if (!address) return '';

    try {
      const res = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            address,
            key: GOOGLE_API_KEY,
          },
        }
      );

      const components =
        res.data.results[0]?.address_components || [];

      const city = components.find(c =>
        c.types.includes('locality')
      )?.long_name;

      const state = components.find(c =>
        c.types.includes('administrative_area_level_1')
      )?.short_name;

      if (!city || !state) return '';

      return `${city}, ${state}`;
    } catch (err) {
      console.error('Geocoding failed:', err);
      return '';
    }
  };

  // ================= Submit =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getAuth().currentUser;

    if (!user) {
      setMessage('You must be logged in.');
      return;
    }

    try {

      const pickupCityState = formData.pickupAddress.length
        ? await getCityStateFromAddress(formData.pickupAddress[0])
        : '';

      const dropoffCityState = formData.dropoffAddress.length
        ? await getCityStateFromAddress(formData.dropoffAddress[0])
        : '';

      await addDoc(collection(db, 'Posts'), {
        ...formData,
        type: 'loads',
        userId: user.uid,
        createdAt: Timestamp.now(),
        pickupCity: pickupCityState,
        dropoffCity: dropoffCityState,
        availableDate: formData.availableDate
        ? Timestamp.fromDate(new Date(formData.availableDate))
        : null,
        likesCounter: 0,
        dislikesCounter: 0,
        likes: [],
        dislikes: [],
      });

      setMessage('Load post added!');
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setMessage('Failed to submit post');
    }
  };

  const publicPath = process.env.PUBLIC_URL;

  if (submitted) {
    return <div className="post-success-message">{message}</div>;
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <label className="form-label">Title</label>
      <input name="title" value={formData.title} onChange={handleChange} required />

      <label className="form-label">Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      {/* Toggle Bar */}
      <div className="toggle-buttons-row">
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} onClick={() => toggleField('address')} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} onClick={() => toggleField('link')} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} onClick={() => toggleField('image')} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} onClick={() => toggleField('tokens')} />
        <img src={`${publicPath}/PostCreationIcons/Routes-Icon.png`} onClick={() => toggleField('routes')} />
        <img src={`${publicPath}/PostCreationIcons/Load-Icon.png`} onClick={() => toggleField('load')} />
      </div>

      {activeField === 'address' && (
        <PostLocationToggle
          postLocationInput={postLocationInput}
          postLocationSuggestions={postLocationSuggestions}
          handlePostLocationChange={handlePostLocationChange}
          selectPostLocation={selectPostLocation}
        />
      )}

      {activeField === 'routes' && (
        <RoutesToggle
          pickupInput={pickupInput}
          dropoffInput={dropoffInput}
          pickupSuggestions={pickupSuggestions}
          dropoffSuggestions={dropoffSuggestions}
          handlePickupChange={handlePickupChange}
          handleDropoffChange={handleDropoffChange}
          selectPickup={selectPickup}
          selectDropoff={selectDropoff}
          removePickup={removePickup}
          removeDropoff={removeDropoff}
          formData={formData}
          handleChange={handleChange}
        />
      )}

      {activeField === 'load' && (
        <LoadInfoToggle formData={formData} handleChange={handleChange} />
      )}

      {activeField === 'link' && (
        <LinkToggle formData={formData} handleChange={handleChange} />
      )}

      {activeField === 'image' && (
        <ImageToggle
          handleFileUpload={handleFileUpload}
          uploading={uploading}
          images={formData.images}
        />
      )}

      {activeField === 'tokens' && (
        <TokensToggle formData={formData} handleChange={handleChange} />
      )}

      <button type="submit" className="submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default LoadPostForm;
