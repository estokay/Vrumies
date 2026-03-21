import React, { useEffect, useState } from "react";
import { db } from "../../Components/firebase";
import { collection, getDocs } from "firebase/firestore";
import PostRenderer from "../../Components/PostLayouts/PostRenderer";
import "./HomeFeed.css";

const allowedTypes = [
  "video",
  "blog",
  "event",
  "request",
  "market",
  "directory",
  "trucks",
  "vehicle",
  "loads"
];

export default function HomeFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Posts"));
        const allPosts = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(post => allowedTypes.includes(post.type));

        // Sort newest first
        allPosts.sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });

        setPosts(allPosts.slice(0, 20)); // limit to top 20
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="home-feed">
      {loading && <p className="feed-loading">Loading posts...</p>}
      {!loading && posts.length === 0 && (
        <p className="feed-empty">No posts available.</p>
      )}
      {posts.map((post) => (
        <div key={post.id} className="feed-card">
          <PostRenderer post={post} />
        </div>
      ))}
    </section>
  );
}