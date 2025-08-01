import React, { useState } from 'react';
import { db } from '../Components/firebase';
import { collection, addDoc } from 'firebase/firestore';
import './RequestPostForm.css';

function RequestPostForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    address: '',
    link: '',
    tokens: 0,
    urgency: 'I Can Wait'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'requestPosts'), formData);
      setMessage('✅ Request post added!');
      setFormData({
        title: '',
        description: '',
        image: '',
        address: '',
        link: '',
        tokens: 0,
        urgency: 'I Can Wait'
      });
    } catch (err) {
      setMessage('❌ Failed to add post.');
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      {['title', 'description', 'image', 'address', 'link'].map((field) => (
        <div key={field}>
          <label className="form-label" htmlFor={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            id={field}
            name={field}
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
          id="tokens"
          name="tokens"
          type="number"
          value={formData.tokens}
          onChange={handleChange}
          placeholder="Tokens"
          required
        />
      </div>

      <div>
        <label className="form-label" htmlFor="urgency">Urgency</label>
        <select
          id="urgency"
          name="urgency"
          value={formData.urgency}
          onChange={handleChange}
        >
          <option value="Urgent">Urgent</option>
          <option value="I Can Wait">I Can Wait</option>
          <option value="Just Looking">Just Looking</option>
        </select>
      </div>

      <button className="submit-btn" type="submit">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default RequestPostForm;
