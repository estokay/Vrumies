/* global __firebase_config, __initial_auth_token, __app_id */
import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app'; // Import getApps and getApp
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import './CreatePostOverlay.css';

// Initialize Firebase only if it hasn't been initialized already
let app;
if (!getApps().length) {
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // If already initialized, get the existing app
}

const db = getFirestore(app);
const auth = getAuth(app);

const initialPostState = {
  title: '',
  postType: '', // This will be set by button clicks
  description: '',
  image: '',
  username: ''
};

const fields = [
  { name: 'title', placeholder: 'Title', required: true },
  // { name: 'postType', placeholder: 'Post Type', required: true }, // Removed, now handled by buttons
  { name: 'description', placeholder: 'Description', required: true },
  { name: 'image', placeholder: 'Image URL or Path', required: false },
  { name: 'username', placeholder: 'Username', required: true }
];

function CreatePostOverlay({ isOpen, onClose }) {
  // Log to check if the component is rendering
  console.log('CreatePostOverlay rendering. isOpen:', isOpen);

  const [post, setPost] = useState(initialPostState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // For custom message box
  const [userId, setUserId] = useState(null); // To store authenticated user ID

  // Authenticate user on component mount
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined') {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.error("Error during Firebase authentication:", e);
      }
    };

    // Listen for auth state changes to get the user ID
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        // Set a default username if not already set
        if (!post.username) {
          setPost(prev => ({ ...prev, username: `User_${user.uid.substring(0, 8)}` }));
        }
      } else {
        setUserId(null); // User logged out or not authenticated
      }
    });

    authenticateUser();
    return () => unsubscribe(); // Cleanup auth listener
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handlePostTypeSelect = (type) => {
    setPost(prev => ({ ...prev, postType: type }));
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 3000); // Message disappears after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Ensure postType is selected
    if (!post.postType) {
      setError('Please select a post type.');
      setLoading(false);
      return;
    }

    // Add userId to the post data if available
    const postData = { ...post, userId: userId || 'anonymous' };

    try {
      // Store public data in /artifacts/{appId}/public/data/posts
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const docRef = await addDoc(collection(db, `artifacts/${appId}/public/data/posts`), postData);
      console.log('Document written with ID:', docRef.id);
      showMessage('✅ Post added!');
      setPost(initialPostState); // Reset form
      onClose(); // Close overlay after success
    } catch (err) {
      console.error('Error adding post:', err);
      setError('Failed to add post. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>Create a New Post</h2>
        <h3 className="subtitle">Select Post Type:</h3>
        <div className="post-type-buttons">
          {['Video', 'Blog', 'Forum', 'Request'].map((type) => (
            <button
              key={type}
              type="button"
              className={`post-type-btn ${post.postType === type ? 'selected' : ''}`}
              onClick={() => handlePostTypeSelect(type)}
              disabled={loading}
            >
              {type}
            </button>
          ))}
        </div>

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
        {message && <div className="message-box">{message}</div>}
      </div>
    </div>
  );
}

export default CreatePostOverlay;
