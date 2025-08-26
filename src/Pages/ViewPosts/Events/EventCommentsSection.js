import React, { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import './EventCommentsSection.css';

function EventCommentsSection({ postId }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const maxChars = 130;

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

  const handleSubmit = async () => {
    if (comment.trim() === '') return;

    try {
      const commentsCol = collection(db, 'Posts', postId, 'comments');
      const newComment = {
        name: 'Current User',
        avatar: `${process.env.PUBLIC_URL}/default-profile.png`,
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

      <div className="comment-input-row">
        <img src={`${process.env.PUBLIC_URL}/default-profile.png`} alt="Current User" className="avatar" />
        <div className="input-container">
          <div className="input-header">
            <span className="username">Current User</span>
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

      {comments.length === 0 ? (
        <p style={{ color: 'white' }}>No comments found.</p>
      ) : (
        comments.map((c, idx) => (
          <div key={c.id || idx} className="comment-row">
            <img src={c.avatar || `${process.env.PUBLIC_URL}/default-profile.png`} alt={c.name || 'User'} className="avatar" />
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
