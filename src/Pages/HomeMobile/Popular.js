import React, { useEffect, useState } from "react";
import { db } from "../../Components/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where
} from "firebase/firestore";
import PostRenderer from "../../Components/PostLayouts/PostRenderer";
import "./Popular.css";

function Popular() {
  const [posts,setPosts] = useState([]);
  const [loading,setLoading] = useState(true);
  const allowedTypes = ["video","blog","event","request","market","directory","trucks","vehicle","loads"];

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const q = query(
          collection(db, "Posts"),
          where("likesCounter", ">", 0),
          orderBy("likesCounter", "desc"),
          limit(50) // 🔥 buffer for filtering
        );

        const snapshot = await getDocs(q);

        const results = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(({ type, likesCounter }) =>
            allowedTypes.includes(type) &&
            typeof likesCounter === "number" &&
            Number.isFinite(likesCounter)
          )
          .slice(0, 20); // ✅ final top 20

        setPosts(results);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  return (
    <div className="popular-panel">
      <div className="popular-header"><h3>🔥 Popular</h3><span className="popular-subtitle">Most liked posts on Vrumies</span></div>
      <div className="popular-scroll">
        {loading && <p className="popular-loading">Loading posts...</p>}
        {!loading && !posts.length && <p className="popular-empty">No popular posts yet.</p>}
        {posts.map(post=>(<div key={post.id} className="popular-post-wrapper"><PostRenderer post={post} /></div>))}
      </div>
    </div>
  );
}

export default Popular;