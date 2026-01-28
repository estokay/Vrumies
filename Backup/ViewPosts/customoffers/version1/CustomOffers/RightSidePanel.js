// RightSidePanel.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OfferPostLayout from '../../../Custom Offers/OfferPostLayout';
import { db } from '../../../Components/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import '../../../Components/Css/ViewPostRightSidePanel.css';

function RightSidePanel() {
  const { id } = useParams(); // post id from URL

  const [ogPost, setOgPost] = useState(null);
  const [posts, setPosts] = useState([]);

  // STEP 1: Load the current post and get its originalPost
  useEffect(() => {
    if (!id) return;

    const fetchOriginalPost = async () => {
      try {
        const postRef = doc(db, 'Posts', id);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const data = postSnap.data();
          setOgPost(data.originalPost ?? id); 
          // fallback to id if originalPost missing
        }
      } catch (error) {
        console.error('Error loading original post:', error);
      }
    };

    fetchOriginalPost();
  }, [id]);

  // STEP 2: Load related posts using ogPost
  useEffect(() => {
    if (!ogPost) return;

    const fetchRelatedPosts = async () => {
      try {
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('originalPost', '==', ogPost));

        const querySnapshot = await getDocs(q);

        const loadedPosts = querySnapshot.docs
          .filter(doc => doc.id !== id) // optional: exclude current post
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

        setPosts(loadedPosts);
      } catch (error) {
        console.error('Error loading related posts:', error);
      }
    };

    fetchRelatedPosts();
  }, [ogPost, id]);

  return (
    <div className="view-main-right-side-panel scrollable-panel">
      <h3 className="view-main-panel-title">Related Offers</h3>

      <div className="view-main-panel-posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <OfferPostLayout key={post.id} {...post} compact />
          ))
        ) : (
          <div className="view-main-panel-empty">
            No related offers yet
          </div>
        )}
      </div>
    </div>
  );
}

export default RightSidePanel;
