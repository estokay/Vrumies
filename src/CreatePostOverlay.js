import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth';
import { db, auth } from './firebase';
import PostForms from './PostForms';  // Import PostForms
import './CreatePostOverlay.css';

const initialPostState = {
  postType: '',
  address: '',
  thumbnailImage: null,
  videoFile: null,
  websiteLink: '',
  tokens: '',
  title: '',
  description: '',
  image: null,
  urgency: '',
  username: ''
};

function CreatePostOverlay({ isOpen, onClose, appId = 'default-app-id' }) {
  const [post, setPost] = useState(initialPostState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        await signInAnonymously(auth);
      } catch (e) {
        console.error("Firebase authentication error:", e);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        if (!post.username) {
          setPost(prev => ({ ...prev, username: `User_${user.uid.slice(0, 8)}` }));
        }
      } else {
        setUserId(null);
      }
    });

    authenticateUser();
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleChange = (name, value) => {
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handlePostTypeSelect = (type) => {
    setPost({
      ...initialPostState,
      postType: type,
      username: post.username || ''
    });
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!post.postType) {
      setError('Please select a post type.');
      setLoading(false);
      return;
    }

    // Prepare post data for Firestore (handle files accordingly)
    const postData = { ...post, userId: userId || 'anonymous' };

    // Note: You need to upload files (thumbnailImage, videoFile, image) to Firebase Storage separately,
    // then save their URLs in postData before saving to Firestore.
    // For now, just omit files or handle file uploads separately.

    // Remove file objects before saving or convert to URLs after upload
    delete postData.thumbnailImage;
    delete postData.videoFile;
    delete postData.image;

    try {
      const docRef = await addDoc(
        collection(db, `artifacts/${appId}/public/data/posts`),
        postData
      );
      console.log('Document written with ID:', docRef.id);
      showMessage('✅ Post added!');
      setPost(initialPostState);
      onClose();
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
          <PostForms
            postType={post.postType}
            post={post}
            onChange={handleChange}
            disabled={loading}
          />
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
