import React, { useState } from 'react';
import { db } from '../Components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import './ForumPostForm.css';

const ForumPostForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    link: '',
    tokens: '',
  });
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleField = (field) => {
    setActiveField((prev) => (prev === field ? null : field));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tokens' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'forumPosts'), {
        ...formData,
        createdAt: Timestamp.now(),
      });
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
      {/* Title */}
      <label className="form-label">Title</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      {/* Description */}
      <label className="form-label">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      {/* Toggle Buttons */}
      <div className="toggle-buttons-row">
        <img
          src={`${process.env.PUBLIC_URL}/PostCreationIcons/Map-Icon.png`}
          alt="Address"
          onClick={() => toggleField('address')}
        />
        <img
          src={`${process.env.PUBLIC_URL}/PostCreationIcons/Link-Icon.png`}
          alt="Link"
          onClick={() => toggleField('link')}
        />
        <img
          src={`${process.env.PUBLIC_URL}/PostCreationIcons/Token-Icon.png`}
          alt="Tokens"
          onClick={() => toggleField('tokens')}
        />
      </div>

      {/* Address */}
      <input
        type="text"
        name="address"
        placeholder="Enter address"
        value={formData.address}
        onChange={handleChange}
        className={activeField === 'address' ? '' : 'hidden-input'}
      />

      {/* Link */}
      <input
        type="text"
        name="link"
        placeholder="Enter link"
        value={formData.link}
        onChange={handleChange}
        className={activeField === 'link' ? '' : 'hidden-input'}
      />

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
