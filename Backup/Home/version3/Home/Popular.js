import React, { useEffect, useState } from "react";
import { db } from "../../Components/firebase";
import {
  collection,
  getDocs
} from "firebase/firestore";
import "./Popular.css";
import PostRenderer from "../../Components/PostLayouts/PostRenderer";

function Popular() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {

    const fetchPopularPosts = async () => {

      try {

        const postsRef = collection(db, "Posts");
        const snapshot = await getDocs(postsRef);

        const results = [];

        snapshot.forEach((docSnap) => {

          const data = docSnap.data();

          if (allowedTypes.includes(data.type)) {

            results.push({
              id: docSnap.id,
              likesCounter: data.likesCounter || 0,
              ...data
            });

          }

        });

        /* SORT BY LIKES */
        results.sort((a, b) => b.likesCounter - a.likesCounter);

        /* LIMIT TO 20 */
        const topPosts = results.slice(0, 20);

        setPosts(topPosts);

      } catch (error) {
        console.error("Error loading popular posts:", error);
      }

      setLoading(false);

    };

    fetchPopularPosts();

  }, []);

  return (

    <div className="popular-panel">

      <div className="popular-header">
        <h3>🔥 Popular</h3>
        <span className="popular-subtitle">
          Most liked posts on Vrumies
        </span>
      </div>

      <div className="popular-scroll">

        {loading && (
          <p className="popular-loading">
            Loading posts...
          </p>
        )}

        {!loading && posts.length === 0 && (
          <p className="popular-empty">
            No popular posts yet.
          </p>
        )}

        {posts.map((post) => (
            <div key={post.id} className="popular-post-wrapper">
                <PostRenderer post={post} />
            </div>
        ))}

      </div>

    </div>

  );
}

export default Popular;