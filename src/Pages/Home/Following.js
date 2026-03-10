import React, { useEffect, useState } from "react";
import { db } from "../../Components/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import PostRenderer from "../../Components/PostLayouts/PostRenderer";
import "./Following.css";

function Following() {

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

    const fetchFollowingPosts = async () => {

      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setLoading(false);
        return;
      }

      const currentUserId = currentUser.uid;

      try {

        const userRef = doc(db, "Users", currentUserId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setLoading(false);
          return;
        }

        const following = userSnap.data().following || [];

        if (following.length === 0) {
          setLoading(false);
          return;
        }

        const postsRef = collection(db, "Posts");

        const q = query(
          postsRef,
          where("userId", "in", following)
        );

        const snapshot = await getDocs(q);

        const results = [];

        snapshot.forEach((docSnap) => {

          const data = docSnap.data();

          if (allowedTypes.includes(data.type)) {

            results.push({
              id: docSnap.id,
              ...data
            });

          }

        });

        results.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return b.createdAt.seconds - a.createdAt.seconds;
        });

        setPosts(results);

      } catch (error) {
        console.error("Error loading following posts:", error);
      }

      setLoading(false);

    };

    fetchFollowingPosts();

  }, []);

  return (

    <div className="following-panel">

      <div className="following-header">
        <h3>👥 Following</h3>
        <span className="following-subtitle">
          Latest posts from people you follow
        </span>
      </div>

      <div className="following-scroll">

        {loading && (
          <p className="following-loading">Loading posts...</p>
        )}

        {!loading && posts.length === 0 && (
          <p className="following-empty">
            No posts from people you follow yet.
          </p>
        )}

        {posts.map((post) => (
            <div key={post.id} className="following-post-wrapper">
                <PostRenderer post={post} />
            </div>
        ))}

      </div>

    </div>

  );
}

export default Following;