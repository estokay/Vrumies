import React, { useState, useEffect, useRef } from 'react';
import './MarketPostForm.css';
import { db } from '../../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { CLOUDINARY_CONFIG, GOOGLE_API_KEY } from '../../Components/config';

import PostLocation from './PostLocation';
import PostLink from './PostLink';
import PostImages from './PostImages';
import PostTokens from './PostTokens';
import PostCondition from './PostCondition';
import PostShippingTime from './PostShippingTime';
import PostPrice from './PostPrice';

const MarketPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', city: '', state: '',
    link: '', tokens: '', images: [], condition: '', shippingTime: '', price: '',
  });
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteServiceRef = useRef(null);

  
  const MAX_IMAGES = 7;
  

  // Google Places
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

  const toggleField = (field) => setActiveField(prev => prev === field ? null : field);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tokens' ? Number(value) || 0 : value
    }));
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationInput(value);

    if (!autocompleteServiceRef.current || !value) return setSuggestions([]);

    autocompleteServiceRef.current.getPlacePredictions({
      input: value, types: ['(cities)'], componentRestrictions: { country: 'us' }
    }, (predictions, status) => {
      if (status !== 'OK' || !predictions) return setSuggestions([]);
      setSuggestions(predictions);
    });
  };

  const selectLocation = (place) => {
    const terms = place.terms;
    const city = terms[0]?.value || '';
    const state = terms[1]?.value || '';
    const fullAddress = `${city}, ${state}`;

    setFormData(prev => ({ ...prev, location: fullAddress, city, state }));
    setLocationInput(fullAddress);
    setSuggestions([]);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (formData.images.length + files.length > MAX_IMAGES) {
      alert(`Max ${MAX_IMAGES} images allowed`);
      return;
    }

    setUploading(true);
    try {
      const urls = await Promise.all(files.map(async file => {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', CLOUDINARY_CONFIG.preset);
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`, fd);
        return res.data.secure_url;
      }));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch {
      alert('Upload failed');
    } finally { setUploading(false); }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getAuth().currentUser;
    if (!user) { setMessage('❌ You must be signed in'); return; }

    try {
      await addDoc(collection(db, 'Posts'), { ...formData, createdAt: Timestamp.now(), type: 'market', userId: user.uid, likesCounter: 0, dislikesCounter: 0, likes: [], dislikes: [] });
      setMessage('✅ Market post added!');
      setSubmitted(true);
    } catch {
      setMessage('❌ Failed to add post');
    }
  };

  const publicPath = process.env.PUBLIC_URL;

  if (submitted) return <div className="mpf-post-success-message"><p>{message}</p></div>;

  return (
    <form className="mpf-post-form" onSubmit={handleSubmit}>
      <label className="mpf-form-label">Title</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} required />

      <label className="mpf-form-label">Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      <div className="mpf-toggle-buttons-row">
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} alt="Location" onClick={() => toggleField('location')} className={activeField==='location'?'active':''} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} alt="Link" onClick={() => toggleField('link')} className={activeField==='link'?'active':''} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} alt="Image" onClick={() => toggleField('image')} className={activeField==='image'?'active':''} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} alt="Tokens" onClick={() => toggleField('tokens')} className={activeField==='tokens'?'active':''} />
        <img src={`${publicPath}/PostCreationIcons/Condition-Icon.png`} alt="Condition" onClick={() => toggleField('condition')} className={activeField==='condition'?'active':''} />
        <img src={`${publicPath}/PostCreationIcons/ShippingTime-Icon.png`} alt="Shipping Time" onClick={() => toggleField('shippingTime')} className={activeField==='shippingTime'?'active':''} />
        <img src={`${publicPath}/PostCreationIcons/Price-Icon.png`} alt="Price" onClick={() => toggleField('price')} className={activeField==='price'?'active':''} />
      </div>

      {activeField === 'location' && <PostLocation value={locationInput} onChange={handleLocationChange} suggestions={suggestions} onSelect={selectLocation} />}
      {activeField === 'link' && <PostLink value={formData.link} onChange={handleChange} />}
      {activeField === 'image' && <PostImages images={formData.images} uploading={uploading} onFileUpload={handleFileUpload} onRemoveImage={handleRemoveImage} maxImages={MAX_IMAGES} />}
      {activeField === 'tokens' && <PostTokens value={formData.tokens} onChange={handleChange} />}
      {activeField === 'condition' && <PostCondition value={formData.condition} onChange={handleChange} />}
      {activeField === 'shippingTime' && <PostShippingTime value={formData.shippingTime} onChange={handleChange} />}
      {activeField === 'price' && (
        <PostPrice
          value={formData.price}
          onChange={(e) => {
            let value = e.target.value.replace(/[^0-9.]/g, '');
            const floatVal = parseFloat(value);
            value = !isNaN(floatVal) ? `$${floatVal.toFixed(2)}` : '$0.00';
            setFormData(prev => ({ ...prev, price: value }));
          }}
        />
      )}

      <button type="submit" className="mpf-submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default MarketPostForm;
