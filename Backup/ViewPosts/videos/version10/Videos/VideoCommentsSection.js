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
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './VideoCommentsSection.css';

function VideoCommentsSection() {
  // ✅ Get postId from URL parameter named "id"
  const { id: postId } = useParams();

  // ✅ State hooks at top level
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [post, setPost] = useState(null);
  const maxChars = 130;

  // ✅ Hook: track logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUserData(null);
        return;
      }

      try {
        const docRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentUserData({ uid: user.uid, ...docSnap.data() });
          return;
        }

        const usersCol = collection(db, 'Users');
        const q = query(usersCol, where('id', '==', user.uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setCurrentUserData({ uid: user.uid, ...snapshot.docs[0].data() });
        } else {
          setCurrentUserData({ uid: user.uid });
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Hook: listen for post updates
  useEffect(() => {
    if (!postId) return;
    const postRef = doc(db, 'Posts', postId);
    const unsubscribe = onSnapshot(postRef, (snapshot) => {
      if (snapshot.exists()) {
        setPost({ id: snapshot.id, ...snapshot.data() });
      }
    });
    return () => unsubscribe();
  }, [postId]);

  // ✅ Hook: fetch comments
  useEffect(() => {
    if (!postId) return;
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

  // ✅ Early return if postId missing (after hooks)
  if (!postId) {
    return <div style={{ color: 'white' }}>Error: postId not found in URL.</div>;
  }

  // ✅ Handle like/dislike
  const handleVote = async (type) => {
    if (!currentUserData) {
      alert('You must be signed in to vote.');
      return;
    }

    const userId = currentUserData.uid;
    const postRef = doc(db, 'Posts', postId);

    try {
      if (type === 'like') {
        await updateDoc(postRef, {
          likes: arrayUnion(userId),
          dislikes: arrayRemove(userId),
        });
      } else if (type === 'dislike') {
        await updateDoc(postRef, {
          dislikes: arrayUnion(userId),
          likes: arrayRemove(userId),
        });
      }

      const updatedSnap = await getDoc(postRef);
      if (updatedSnap.exists()) {
        const updatedData = updatedSnap.data();
        await updateDoc(postRef, {
          likesCounter: updatedData.likes?.length || 0,
          dislikesCounter: updatedData.dislikes?.length || 0,
        });
      }
    } catch (err) {
      console.error('Error updating vote:', err);
    }
  };

  // ✅ Handle comment submission
  const handleSubmit = async () => {
    if (comment.trim() === '') return;

    try {
      const user = auth.currentUser;
      if (!user || !currentUserData) {
        alert('You must be signed in to comment.');
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

  // ✅ Prepare like/dislike state
  const userId = currentUserData?.uid;
  const likes = post?.likes || [];
  const dislikes = post?.dislikes || [];
  const hasLiked = userId && likes.includes(userId);
  const hasDisliked = userId && dislikes.includes(userId);

  return (
    <div className="event-comments-section">
      <div className="section-header">
        <h2>COMMENTS SECTION</h2>
        <div className="votes">
          <button
            className={`vote-btn like-btn ${hasLiked ? 'active' : ''}`}
            onClick={() => handleVote('like')}
          >
            <FaThumbsUp className="vote-icon" /> {post?.likesCounter ?? likes.length}
          </button>
          <button
            className={`vote-btn dislike-btn ${hasDisliked ? 'active' : ''}`}
            onClick={() => handleVote('dislike')}
          >
            <FaThumbsDown className="vote-icon" /> {post?.dislikesCounter ?? dislikes.length}
          </button>
        </div>
      </div>

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

      {loading ? (
        <p style={{ color: 'white' }}>Loading comments...</p>
      ) : comments.length === 0 ? (
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

export default VideoCommentsSection;
