import React, { useEffect, useState } from 'react';
import OfferPostLayout from './OfferPostLayout';
import { db } from '../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './ViewOffers.css';
import { useParams } from 'react-router-dom';

import CreateCustomOfferPostOverlay from './CreateCustomOfferPostOverlay';

function ViewOffers() {
  
  const { id } = useParams();
  const postId = id;

  const [posts, setPosts] = useState([]);
  const [showCreateOverlay, setShowCreateOverlay] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    const fetchDirectoryPosts = async () => {
      try {
        const postsRef = collection(db, "Posts");

        const q = query(
          postsRef,
          where("originalPost", "==", postId)
        );

        const querySnapshot = await getDocs(q);

        const loadedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(loadedPosts);
      } catch (error) {
        console.error("Error loading filtered offer posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectoryPosts();
  }, [postId]);

  const filteredPosts = posts
    .filter((post) => typeof post.tokens === 'number')
    .sort((a, b) => b.tokens - a.tokens);

  const handleCreateCustomOffer = () => {
    setShowCreateOverlay(true);
  };

  return (
    <>
      <div className="view-offers-right-side-panel">
        <h3 className="view-offers-panel-title">Custom Offers</h3>

        <div className="view-offers-panel-posts">
          {/* Create Custom Offer card always visible */}
          <div
            className="view-offers-create-card"
            onClick={handleCreateCustomOffer}
          >
            <span className="create-card-text">+ CREATE CUSTOM OFFER</span>
          </div>

          {/* Loading state */}
          {loading && (
            <p className="view-offers-loading">Loading offers...</p>
          )}

          {/* No offers yet */}
          {!loading && filteredPosts.length === 0 && (
            <p className="view-offers-empty">
              No offers yet — be the first to create one.
            </p>
          )}

          {/* Offers list */}
          {filteredPosts.map((post) => (
            <OfferPostLayout
              key={post.id}
              {...post}
              compact
            />
          ))}
        </div>
      </div>

      <CreateCustomOfferPostOverlay
        isOpen={showCreateOverlay}
        onClose={() => setShowCreateOverlay(false)}
        originalPost={postId}
      />
    </>
  );
}

export default ViewOffers;
