import React, { useEffect, useState } from "react";
import QuotePostLayout from "../Directory/QuotePostLayout";
import { db } from "../../../Components/firebase";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import "./ViewRequestedQuotesMobile.css";

function ViewRequestedQuotesMobile({
  directoryPostId,
  sellerUserId,
  onSelectQuote,
  onAddQuoteToCart,
}) {
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
      "Posts",
      directoryPostId,
      "Requested Quotes"
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
        console.error("Error loading requested quotes:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [directoryPostId]);

  const filteredPosts = [...posts].sort(
    (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
  );

  return (
    <div className="vrqm-container">
      <div className="vrqm-header">
        <h2 className="vrqm-title">Requested Quotes</h2>
      </div>

      <div className="vrqm-posts-wrapper">
        {/* Loading */}
        {loading && (
          <p className="vrqm-loading">
            Loading quotes...
          </p>
        )}

        {/* Empty */}
        {!loading && filteredPosts.length === 0 && (
          <div className="vrqm-empty-card">
            <p>
              No requested quotes yet — be the first to request a quote.
            </p>
          </div>
        )}

        {/* Quotes */}
        {filteredPosts.map((post) => (
          <div className="vrqm-quote-card" key={post.id}>
            <QuotePostLayout
              {...post}
              sellerUserId={sellerUserId}
              directoryPostId={directoryPostId}
              requestedQuoteId={post.id}
              onSelectQuote={onSelectQuote}
              onAddQuoteToCart={onAddQuoteToCart}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewRequestedQuotesMobile;