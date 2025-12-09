// src/YourPath/PostSidePanel.js
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./PostSidePanel.css"; // you can rename this CSS later if you want (optional)

// 🔹 Import all possible layout components
import VideosPostLayout from "../Pages/MainCategories/Videos/VideosPostLayout";
import BlogPostLayout from "../Pages/MainCategories/Blogs/BlogPostLayout";
import RequestPostLayout from "../Pages/MainCategories/Requests/RequestPostLayout";
import VehiclePostLayout from "../Pages/MainCategories/Vehicles/VehiclePostLayout";
import MarketPostLayout from "../Pages/MainCategories/Market/MarketPostLayout";
import EventsPostLayout from "../Pages/MainCategories/Events/EventsPostLayout";
import DirectoryPostLayout from "../Pages/MainCategories/Directory/DirectoryPostLayout";

import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * PostSidePanel
 * - Accepts `postType` (string) and defaults to "event".
 * - Fetches posts from Firestore where `type` === postType.
 * - Dynamically renders layout component matching postType.
 */
const PostSidePanel = ({ postType = "event" }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

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

  // 🔹 Dynamically select which layout to use
  const getLayoutComponent = (post) => {
    switch (postType) {
      case "video":
        return <VideosPostLayout key={post.id} {...post} />;
      case "blog":
        return <BlogPostLayout key={post.id} {...post} />;
      case "request":
        return <RequestPostLayout key={post.id} {...post} />;
      case "vehicle":
        return <VehiclePostLayout key={post.id} {...post} />;
      case "market":
        return <MarketPostLayout key={post.id} {...post} />;
      case "event":
        return <EventsPostLayout key={post.id} {...post} />;
      case "directory":
        return <DirectoryPostLayout key={post.id} {...post} />;
      default:
        return <p key={post.id}>Unknown post type: {postType}</p>;
    }
  };

  return (
    <div className="event-post-side-panel">
      <div className="panel-title">{capitalize(postType)} Posts</div>

      {loading && (
        <div className="panel-loading">Loading {postType} posts...</div>
      )}

      {error && <div className="panel-error">{error}</div>}

      {!loading && !error && (
        <div className="panel-posts">
          {posts.length > 0 ? (
            posts.map((post) => getLayoutComponent(post))
          ) : (
            <p className="no-posts">No {postType} posts found.</p>
          )}
        </div>
      )}
    </div>
  );
};

// 🔹 Utility function
function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

PostSidePanel.propTypes = {
  postType: PropTypes.string,
};

export default PostSidePanel;
