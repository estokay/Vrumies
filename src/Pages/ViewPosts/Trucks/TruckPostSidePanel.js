// src/YourPath/EventPostSidePanel.js
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./TruckPostSidePanel.css";
import TruckPostLayout from "../../MainCategories/Trucks/TruckPostLayout";
import { db } from "../../../Components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * EventPostSidePanel
 * - Accepts `postType` (string) and defaults to "event".
 * - Fetches posts from Firestore collection "Posts" where field `type` === postType.
 * - Reruns query automatically when postType changes.
 */
const TruckPostSidePanel = ({ postType = "trucks" }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // prevent state update if unmounted

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const postsRef = collection(db, "Posts");
        const q = query(postsRef, where("type", "==", postType));
        const snapshot = await getDocs(q);

        const postsData = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        if (isMounted) {
          setPosts(postsData);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        if (isMounted) setError("Failed to load posts.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [postType]);

  // Render
  return (
    <div className="event-post-side-panel">
      <div className="panel-title">
        {postType ? `${capitalize(postType)} Posts` : "Posts"}
      </div>

      {loading && <div className="panel-loading">Loading {postType} posts...</div>}

      {error && <div className="panel-error">{error}</div>}

      {!loading && !error && (
        <div className="panel-posts">
          {posts.length > 0 ? (
            posts.map((post) => <EventsPostLayout key={post.id} {...post} />)
          ) : (
            <p className="no-posts">No {postType} posts found.</p>
          )}
        </div>
      )}
    </div>
  );
};

// small helper
function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

EventPostSidePanel.propTypes = {
  postType: PropTypes.string,
};

export default TruckPostSidePanel;
