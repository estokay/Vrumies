import React, { useState, useEffect, useRef } from 'react';
import './OfferPostForm.css';
import { db } from '../../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { CLOUDINARY_CONFIG, GOOGLE_API_KEY } from '../../Components/config';

import PostLocation from './PostLocation';
import PostLink from './PostLink';
import PostImages from './PostImages';
import PostTokens from './PostTokens';
import PostPrice from './PostPrice';

import useSendNotificationOffer from '../../Components/Notifications/useSendNotificationOffer';
import useGetSellerId from '../../Hooks/useGetSellerId';


const OfferPostForm = ({ originalPost }) => {
  const [activeField, setActiveField] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const autocompleteServiceRef = useRef(null);
  const MAX_IMAGES = 7;

  const [notificationData, setNotificationData] = useState(null);

  const { sellerId, loading } = useGetSellerId(originalPost);

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const isOwnPost = sellerId && currentUser?.uid === sellerId;
  const isDisabled = loading || isOwnPost;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    city: '',
    state: '',
    link: '',
    tokens: 0,
    images: [],
    price: ''
  });

  useSendNotificationOffer(notificationData || {});

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

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (formData.images.length + files.length > MAX_IMAGES) {
      alert(`You can upload a maximum of ${MAX_IMAGES} images.`);
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

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const user = getAuth().currentUser;

  if (!user) {
    setMessage('❌ You must be signed in.');
    return;
  }

  if (loading) {
    setMessage('Please wait...');
    return;
  }

  if (sellerId && user.uid === sellerId) {
    setMessage('❌ You cannot add a custom offer to your own post.');
    return;
  }

  try {
      const docRef = await addDoc(collection(db, 'Posts'), {
        ...formData,
        createdAt: Timestamp.now(),
        type: 'offer',
        userId: user.uid,
        originalPost: originalPost || null,
        likesCounter: 0,
        dislikesCounter: 0,
        likes: [],
        dislikes: []
      });

      if (originalPost && sellerId) {
        setNotificationData({
          sellerId,
          fromId: user.uid,
          postId: originalPost,
          offerPostId: docRef.id   // now docRef is defined
        });
      }

      setSubmitted(true);
      setMessage('✅ Offer post added!');
    } catch (err) {
      console.error('Error adding document:', err);
      setMessage('❌ Failed to add post. Please try again.');
    }
  };

  const publicPath = process.env.PUBLIC_URL;

  if (submitted) {
    return <p className="mpf-post-success-message">{message}</p>;
  }

  return (
    <form className="mpf-post-form" onSubmit={handleSubmit}>
      <label className="mpf-form-label">Title</label>
      <input name="title" value={formData.title} onChange={handleChange} required />

      <label className="mpf-form-label">Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      <div className="mpf-toggle-buttons-row">
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} onClick={() => toggleField('location')} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} onClick={() => toggleField('link')} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} onClick={() => toggleField('image')} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} onClick={() => toggleField('tokens')} />
        <img src={`${publicPath}/PostCreationIcons/Price-Icon.png`} onClick={() => toggleField('price')} />
      </div>

      {activeField === 'location' && (
        <PostLocation
          locationInput={locationInput}
          suggestions={suggestions}
          onLocationChange={handleLocationChange}
          onSelectLocation={selectLocation}
        />
      )}

      {activeField === 'link' && (
        <PostLink value={formData.link} onChange={handleChange} />
      )}

      {activeField === 'image' && (
        <PostImages
          images={formData.images}
          uploading={uploading}
          maxImages={MAX_IMAGES}
          onUpload={handleFileUpload}
          onRemove={handleRemoveImage}
        />
      )}

      {activeField === 'tokens' && (
        <PostTokens value={formData.tokens} onChange={handleChange} />
      )}

      {activeField === 'price' && (
        <PostPrice
          value={formData.price}
          onChange={(e) => {
            let val = e.target.value.replace(/[^0-9.]/g, '');
            const num = parseFloat(val);
            setFormData(prev => ({
              ...prev,
              price: !isNaN(num) ? `$${num.toFixed(2)}` : ''
            }));
          }}
        />
      )}

      <button
        type="submit"
        className="mpf-submit-btn"
        disabled={isDisabled}
      >
        {loading
          ? "Loading..."
          : isOwnPost
          ? "Cannot Create An Offer On Your Own Post"
          : "Submit"}
      </button>
      {message && <p>{message}</p>}
      {isOwnPost && (
        <p className="mpf-error-text">
          ❌ You cannot add a custom offer to your own post.
        </p>
      )}
    </form>
  );
};

export default OfferPostForm;
