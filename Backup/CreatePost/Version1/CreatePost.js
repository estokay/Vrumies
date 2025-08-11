import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';  // Use db, not firestore
import './CreatePost.css';

const initialPostState = {
  title: '',
  postType: '',
  description: '',
  image: '',
  username: ''
};

const fields = [
  { name: 'title', placeholder: 'Title', required: true },
  { name: 'postType', placeholder: 'Post Type', required: true },
  { name: 'description', placeholder: 'Description', required: true },
  { name: 'image', placeholder: 'Image URL or Path', required: false },
  { name: 'username', placeholder: 'Username', required: true }
];

function CreatePost() {
  const [post, setPost] = useState(initialPostState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      console.log('Firestore DB instance:', db);
      const docRef = await addDoc(collection(db, 'posts'), post);
      console.log('Document written with ID:', docRef.id);
      alert('✅ Post added!');
      setPost(initialPostState);
    } catch (err) {
      console.error('Error adding post:', err);
      setError('Failed to add post. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="create-post">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        {fields.map(({ name, placeholder, required }) => (
          <input
            key={name}
            name={name}
            placeholder={placeholder}
            value={post[name]}
            onChange={handleChange}
            required={required}
            disabled={loading}
          />
        ))}
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default CreatePost;
