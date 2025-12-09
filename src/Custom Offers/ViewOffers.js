import React, { useEffect, useState } from 'react';
import OfferPostLayout from './OfferPostLayout';
import { db } from '../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './ViewOffers.css';

import CreateCustomOfferPostOverlay from './CreateCustomOfferPostOverlay';

function ViewOffers() {
  const [posts, setPosts] = useState([]);
  const [showCreateOverlay, setShowCreateOverlay] = useState(false);

  useEffect(() => {
    const fetchDirectoryPosts = async () => {
      try {
        const postsRef = collection(db, "Posts");
        const q = query(postsRef, where("type", "==", "event"));

        const querySnapshot = await getDocs(q);

        const loadedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(loadedPosts);
      } catch (error) {
        console.error("Error loading event posts:", error);
      }
    };

    fetchDirectoryPosts();
  }, []);

  if (!posts || posts.length === 0) return null;

  const filteredPosts = posts
    .filter((post) => typeof post.tokens === 'number')
    .sort((a, b) => b.tokens - a.tokens);

  // Handler for the "Create Custom Offer" card
  const handleCreateCustomOffer = () => {
    setShowCreateOverlay(true);
  };

  return (
    <>
      <div className="view-offers-right-side-panel">
        <h3 className="view-offers-panel-title">Custom Offers</h3>

        <div className="view-offers-panel-posts">
          {/* First card: Create Custom Offer */}
          <div
            className="view-offers-create-card"
            onClick={handleCreateCustomOffer}
          >
            <span className="create-card-text">+ CREATE CUSTOM OFFER</span>
          </div>

          {/* Remaining posts */}
          {filteredPosts.map((post) => (
            <OfferPostLayout key={post.id} {...post} compact />
          ))}
        </div>
      </div>

      {/* CREATE OFFER OVERLAY */}
      <CreateCustomOfferPostOverlay
        isOpen={showCreateOverlay}
        onClose={() => setShowCreateOverlay(false)}
      />
    </>
  );
}

export default ViewOffers;
