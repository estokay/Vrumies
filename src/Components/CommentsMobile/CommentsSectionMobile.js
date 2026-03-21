import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
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
import { FaThumbsUp, FaThumbsDown, FaPaperPlane } from 'react-icons/fa';
import './CommentsSectionMobile.css';
import SendNotificationComment from '../Notifications/SendNotificationComment';

const CommentsSectionMobile = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [post, setPost] = useState(null);
  const [newCommentNotification, setNewCommentNotification] = useState(null);
  const maxChars = 130;

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
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    });
    return () => unsubscribe();
  }, []);

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

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const commentsCol = collection(db, 'Posts', postId, 'comments');
        const snapshot = await getDocs(commentsCol);
        const commentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        setComments(commentsData);
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleVote = async (type) => {
    if (!currentUserData) return alert('Login required');
    const userId = currentUserData.uid;
    const postRef = doc(db, 'Posts', postId);

    try {
      if (type === 'like') {
        await updateDoc(postRef, {
          likes: arrayUnion(userId),
          dislikes: arrayRemove(userId),
        });
      } else {
        await updateDoc(postRef, {
          dislikes: arrayUnion(userId),
          likes: arrayRemove(userId),
        });
      }
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  const handleSubmit = async () => {
    if (comment.trim() === '' || !currentUserData) return;

    try {
      const commentsCol = collection(db, 'Posts', postId, 'comments');
      const newComment = {
        name: currentUserData.username || 'Anonymous',
        avatar: currentUserData.profilepic || '/default-profile.png',
        text: comment,
        date: new Date().toLocaleDateString(),
        createdAt: Timestamp.now(),
      };

      await addDoc(commentsCol, newComment);
      setComments([newComment, ...comments]);
      setComment('');

      setNewCommentNotification({
        sellerId: post?.userId,
        fromId: currentUserData.uid,
        postId: postId,
        comment: newComment.text,
      });
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  const userId = currentUserData?.uid;
  const hasLiked = userId && post?.likes?.includes(userId);
  const hasDisliked = userId && post?.dislikes?.includes(userId);

  return (
    <div className="csm-wrapper">
      <div className="csm-stats-bar">
        <span className="csm-count-label">{comments.length} Comments</span>
        <div className="csm-vote-group">
          <button className={`csm-vote-pill ${hasLiked ? 'liked' : ''}`} onClick={() => handleVote('like')}>
            <FaThumbsUp /> {post?.likes?.length || 0}
          </button>
          <button className={`csm-vote-pill ${hasDisliked ? 'disliked' : ''}`} onClick={() => handleVote('dislike')}>
            <FaThumbsDown /> {post?.dislikes?.length || 0}
          </button>
        </div>
      </div>

      <div className="csm-input-area">
        <img src={currentUserData?.profilepic || "/default-profile.png"} className="csm-user-thumb" alt="me" />
        <div className="csm-field-wrapper">
          <input 
            className="csm-input-box"
            placeholder="Add a comment..." 
            value={comment}
            maxLength={maxChars}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="csm-send-btn" onClick={handleSubmit} disabled={!comment.trim()}>
            <FaPaperPlane />
          </button>
        </div>
      </div>

      <div className="csm-list">
        {loading ? (
          <div className="csm-status">Loading...</div>
        ) : comments.length === 0 ? (
          <div className="csm-status">No comments yet.</div>
        ) : (
          comments.map((c, i) => (
            <div key={c.id || i} className="csm-card">
              <img src={c.avatar} className="csm-card-avatar" alt="user" />
              <div className="csm-card-body">
                <div className="csm-card-header">
                  <span className="csm-card-name">{c.name}</span>
                  <span className="csm-card-date">{c.date}</span>
                </div>
                <p className="csm-card-text">{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {newCommentNotification && (
        <SendNotificationComment
          {...newCommentNotification}
          clearNotification={() => setNewCommentNotification(null)}
        />
      )}
    </div>
  );
};

export default CommentsSectionMobile;