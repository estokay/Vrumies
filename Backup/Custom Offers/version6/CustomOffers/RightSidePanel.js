// RightSidePanel.js
import React, { useEffect, useState } from 'react';
import OfferPostLayout from '../../../Custom Offers/OfferPostLayout';
import { db } from '../../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../../../Components/Css/ViewPostRightSidePanel.css';

function RightSidePanel() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchDirectoryPosts = async () => {
      try {
        const postsRef = collection(db, "Posts");
        const q = query(postsRef, where("type", "==", "offer"));

        const querySnapshot = await getDocs(q);

        const loadedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(loadedPosts);
      } catch (error) {
        console.error("Error loading offer posts:", error);
      }
    };

    fetchDirectoryPosts();
  }, []);

  if (!posts || posts.length === 0) return null;

  // Filter posts with valid tokens and sort desc by tokens
  const filteredPosts = posts
    .filter((post) => typeof post.tokens === 'number')
    .sort((a, b) => b.tokens - a.tokens);

  return (
    <div className="view-main-right-side-panel scrollable-panel">
      <h3 className="view-main-panel-title">Promoted Offers</h3>
      <div className="view-main-panel-posts">
        {filteredPosts.map((post) => (
          <OfferPostLayout key={post.id} {...post} compact />
        ))}
      </div>
    </div>
  );
}

export default RightSidePanel;
