import React, { useEffect, useState } from "react";
import { db } from "../../Components/firebase";
import { collection, getDocs } from "firebase/firestore";
import BookmarksPostLayout from "../Bookmarks/BookmarksPostLayout";
import "./PromotedPosts.css";

function PromotedPosts() {

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

    const fetchPromotedPosts = async () => {

      try {

        const postsRef = collection(db, "Posts");
        const snapshot = await getDocs(postsRef);

        const results = [];

        snapshot.forEach((docSnap) => {

          const data = docSnap.data();

          if (allowedTypes.includes(data.type)) {

            results.push({
              id: docSnap.id,
              tokens: data.tokens || 0,
              ...data
            });

          }

        });

        /* SORT BY TOKENS USED (DESCENDING) */
        results.sort((a, b) => b.tokens - a.tokens);

        /* LIMIT TO 20 */
        const topPosts = results.slice(0, 20);

        setPosts(topPosts);

      } catch (error) {
        console.error("Error loading promoted posts:", error);
      }

      setLoading(false);

    };

    fetchPromotedPosts();

  }, []);

  return (

    <div className="promoted-panel">

      <div className="promoted-header">
        <h3>🚀 Promoted Posts</h3>
        <span className="promoted-subtitle">
          Posts boosted with the most tokens
        </span>
      </div>

      <div className="promoted-scroll">

        {loading && (
          <p className="promoted-loading">
            Loading promoted posts...
          </p>
        )}

        {!loading && posts.length === 0 && (
          <p className="promoted-empty">
            No promoted posts yet.
          </p>
        )}

        {posts.map((post) => (

          <div
            key={post.id}
            className="promoted-post-wrapper"
          >

            <BookmarksPostLayout
              id={post.id}
              images={post.images}
              title={post.title}
              createdAt={post.createdAt}
              userId={post.userId}
            />

          </div>

        ))}

      </div>

    </div>

  );
}

export default PromotedPosts;