import React, { useState, useEffect, useRef } from 'react';
import './VehiclePostForm.css';
import { db } from '../../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import AddressField from './AddressField';
import LinkField from './LinkField';
import ImageUploadField from './ImageUploadField';
import TokenField from './TokenField';

const VehiclePostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    city: '',
    state: '',
    link: '',
    images: [],
    tokens: '',
  });

  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleField = (field) => {
    setActiveField(prev => (prev === field ? null : field));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tokens' ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getAuth().currentUser;

    if (!user) {
      setMessage('❌ You must be logged in.');
      return;
    }

    try {
      await addDoc(collection(db, 'Posts'), {
        ...formData,
        tokens: formData.tokens || 0,
        createdAt: Timestamp.now(),
        type: 'vehicle',
        userId: user.uid,
        likes: [],
        dislikes: [],
        likesCounter: 0,
        dislikesCounter: 0,
      });

      setMessage('✅ Vehicle post created!');
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to submit post.');
    }
  };

  const publicPath = process.env.PUBLIC_URL;

  return submitted ? (
    <div className="post-success-message">{message}</div>
  ) : (
    <form className="post-form" onSubmit={handleSubmit}>

      <label className="form-label">Title</label>
      <input name="title" value={formData.title} onChange={handleChange} required />

      <label className="form-label">Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      {/* TOGGLE BUTTONS */}
      <div className="toggle-buttons-row">
        <img src={`${publicPath}/PostCreationIcons/Map-Icon.png`} onClick={() => toggleField('address')} className={activeField === 'address' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Link-Icon.png`} onClick={() => toggleField('link')} className={activeField === 'link' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Image-Icon.png`} onClick={() => toggleField('image')} className={activeField === 'image' ? 'active' : ''} />
        <img src={`${publicPath}/PostCreationIcons/Token-Icon.png`} onClick={() => toggleField('tokens')} className={activeField === 'tokens' ? 'active' : ''} />
      </div>

      {activeField === 'address' && (
        <AddressField formData={formData} setFormData={setFormData} />
      )}

      {activeField === 'link' && (
        <LinkField value={formData.link} onChange={handleChange} />
      )}

      {activeField === 'image' && (
        <ImageUploadField formData={formData} setFormData={setFormData} />
      )}

      {activeField === 'tokens' && (
        <TokenField value={formData.tokens} onChange={handleChange} />
      )}

      <button type="submit" className="submit-btn">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default VehiclePostForm;
