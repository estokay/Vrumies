import React, { useEffect, useState } from "react";
import "./RequestPostSidePanel.css";
import RequestPostLayout from "../../MainCategories/Requests/RequestPostLayout";
import { db } from "../../../Components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const RequestPostSidePanel = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 🔹 Get all posts where type == "request"
        const postsRef = collection(db, "Posts");
        const q = query(postsRef, where("type", "==", "request"));
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
    return <div className="event-post-side-panel">Loading request posts...</div>;
  }

  return (
    <div className="event-post-side-panel">
      <div className="panel-title">Related Requests</div>
      <div className="panel-posts">
        {posts.map((post) => (
          <RequestPostLayout key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default RequestPostSidePanel;
