import React, { useEffect, useState } from 'react';
import QuotePostLayout from './QuotePostLayout';
import { db } from '../../../Components/firebase';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import './ViewRequestedQuotes.css';

function ViewRequestedQuotes({ directoryPostId, sellerUserId, onSelectQuote, onAddQuoteToCart, }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!directoryPostId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const requestedQuotesRef = collection(
      db,
      'Posts',
      directoryPostId,
      'Requested Quotes'
    );

    const unsubscribe = onSnapshot(
      requestedQuotesRef,
      (snapshot) => {
        const loadedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(loadedPosts);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading requested quotes:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [directoryPostId]);

  const filteredPosts = [...posts].sort(
    (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
  );

  return (
    <>
      <div className="view-requested-quotes-right-side-panel">
        <h3 className="view-requested-quotes-panel-title">
          Requested Quotes
        </h3>

        <div className="view-requested-quotes-panel-posts">

          {/* Loading state */}
          {loading && (
            <p className="view-requested-quotes-loading">
              Loading quotes...
            </p>
          )}

          {/* Empty state */}
          {!loading && filteredPosts.length === 0 && (
            <p className="view-requested-quotes-empty">
              No requested quotes yet — be the first to request a quote.
            </p>
          )}

          {/* Quotes list */}
          {filteredPosts.map((post) => (
            <QuotePostLayout
              key={post.id}
              {...post}
              sellerUserId={sellerUserId}
              directoryPostId={directoryPostId}
              requestedQuoteId={post.id}
              onSelectQuote={onSelectQuote}
              onAddQuoteToCart={onAddQuoteToCart}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default ViewRequestedQuotes;