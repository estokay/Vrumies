import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../Components/firebase';
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  query,
  where,
  doc,
  getDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './EventCommentsSection.css';

function EventCommentsSection({ postId }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState(null); // holds username + profilepic
  const maxChars = 130;

  // ✅ Fetch signed-in user's profile once auth is ready
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUserData(null);
        return;
      }
      try {
        // Try Users/{uid} first (if you use UID as the doc id)
        const docRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentUserData(docSnap.data());
          return;
        }

        // Fallback: query by field 'id' == uid (if docs use auto-IDs)
        const usersCol = collection(db, 'Users');
        const q = query(usersCol, where('id', '==', user.uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setCurrentUserData(snapshot.docs[0].data());
        } else {
          console.warn('User not found in Users collection for uid:', user.uid);
          setCurrentUserData(null);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
        setCurrentUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const commentsCol = collection(db, 'Posts', postId, 'comments');
        const snapshot = await getDocs(commentsCol);
        const commentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setComments(commentsData);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  // Handle comment submission
  const handleSubmit = async () => {
    if (comment.trim() === '') return;

    try {
      const user = auth.currentUser;
      if (!user) {
        alert('You must be signed in to comment.');
        return;
      }

      if (!currentUserData) {
        alert('User data not loaded.');
        return;
      }

      const commentsCol = collection(db, 'Posts', postId, 'comments');
      const newComment = {
        name: currentUserData.username || 'Unknown User',
        avatar: currentUserData.profilepic || `${process.env.PUBLIC_URL}/default-profile.png`,
        text: comment,
        date: new Date().toLocaleDateString(),
        createdAt: Timestamp.now(),
      };

      await addDoc(commentsCol, newComment);
      setComments(prev => [newComment, ...prev]);
      setComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to submit comment.');
    }
  };

  if (loading) return <p style={{ color: 'white' }}>Loading comments...</p>;

  return (
    <div className="event-comments-section">
      <div className="section-header">
        <h2>COMMENTS SECTION</h2>
        <div className="votes">
          <span className="likes">👍 60</span>
          <span className="dislikes">👎 9</span>
        </div>
      </div>

      {/* Input Row */}
      <div className="comment-input-row">
        <img
          src={currentUserData?.profilepic || `${process.env.PUBLIC_URL}/default-profile.png`}
          alt={currentUserData?.username || 'Current User'}
          className="avatar"
        />
        <div className="input-container">
          <div className="input-header">
            <span className="username">{currentUserData?.username || 'Current User'}</span>
            <span className="date">{new Date().toLocaleDateString()}</span>
            <span className="char-limit">Maximum Characters Allowed: {maxChars}</span>
          </div>
          <input
            type="text"
            value={comment}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) setComment(e.target.value);
            }}
            placeholder="Type your comment here..."
          />
        </div>
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>

      {/* Render Comments */}
      {comments.length === 0 ? (
        <p style={{ color: 'white' }}>No comments found.</p>
      ) : (
        comments.map((c, idx) => (
          <div key={c.id || idx} className="comment-row">
            <img
              src={c.avatar || `${process.env.PUBLIC_URL}/default-profile.png`}
              alt={c.name || 'User'}
              className="avatar"
            />
            <div className="comment-content">
              <div className="comment-header">
                <span className="username">{c.name || 'Unknown'}</span>
                <span className="date">{c.date || 'Date not available'}</span>
              </div>
              <p>{c.text || 'No comment text'}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default EventCommentsSection;
