import React, { useEffect, useState } from "react";
import "./DirectoryPostSidePanel.css";
import DirectoryPostLayout from "../../MainCategories/Directory/DirectoryPostLayout";
import { db } from "../../../Components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const DirectoryPostSidePanel = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 🔹 Get all posts where type == "event"
        const postsRef = collection(db, "Posts");
        const q = query(postsRef, where("type", "==", "directory"));
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
    return <div className="event-post-side-panel">Loading directory posts...</div>;
  }

  return (
    <div className="event-post-side-panel">
      <div className="panel-title">Related Directory Posts</div>
      <div className="panel-posts">
        {posts.map((post) => (
          <DirectoryPostLayout key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default DirectoryPostSidePanel;
