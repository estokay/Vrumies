import React, { useState } from 'react';
import { db } from '../Components/firebase';
import { collection, addDoc } from 'firebase/firestore';
import './VideoPostForm.css';

function VideoPostForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video: '',
    image: '',
    address: '',
    link: '',
    tokens: 0
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'videoPosts'), formData);
      setMessage('✅ Video post added!');
      setFormData({
        title: '',
        description: '',
        video: '',
        image: '',
        address: '',
        link: '',
        tokens: 0
      });
    } catch (err) {
      setMessage('❌ Failed to add post.');
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      {['title', 'description', 'address', 'link', 'video', 'image'].map((field) => (
        <div key={field}>
          <label className="form-label" htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input
            name={field}
            id={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field}
            required
          />
        </div>
      ))}

      <div>
        <label className="form-label" htmlFor="tokens">Tokens</label>
        <input
          name="tokens"
          id="tokens"
          type="number"
          value={formData.tokens}
          onChange={handleChange}
          placeholder="Tokens"
          required
        />
      </div>

      <button className="submit-btn" type="submit">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default VideoPostForm;
