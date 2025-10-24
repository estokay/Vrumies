import React, { useEffect, useState } from "react";
import "./ForumPostSidePanel.css";
import ForumPostLayout from "../../MainCategories/Forums/ForumPostLayout";
import { db } from "../../../Components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const ForumPostSidePanel = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 🔹 Get all posts where type == "forum"
        const postsRef = collection(db, "Posts");
        const q = query(postsRef, where("type", "==", "forum"));
        const snapshot = await getDocs(q);

        const postsData = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(), // keep Firestore fields: images, title, createdAt, userId
        }));

        console.log("Fetched posts:", postsData); // ✅ Debugging
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="event-post-side-panel">Loading Forums...</div>;
  }

  return (
    <div className="event-post-side-panel">
      <div className="panel-title">Related Forums</div>
      <div className="panel-posts">
        {posts.map((post) => (
          <ForumPostLayout key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default ForumPostSidePanel;
