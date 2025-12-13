import React, { useEffect, useState } from "react";
import "./VideoPostSidePanel.css";
import VideoPostLayout from "../../MainCategories/Videos/VideosPostLayout";
import { db } from "../../../Components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const VideoPostSidePanel = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 🔹 Get all posts where type == "vehicle"
        const postsRef = collection(db, "Posts");
        const q = query(postsRef, where("type", "==", "video"));
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
    return <div className="event-post-side-panel">Loading video posts...</div>;
  }

  return (
    <div className="event-post-side-panel">
      <div className="panel-title">Related Video Posts</div>
      <div className="panel-posts">
        {posts.map((post) => (
          <VideoPostLayout key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default VideoPostSidePanel;
