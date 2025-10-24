import React, { useEffect, useState } from "react";
import "./VehiclePostSidePanel.css";
import VehiclePostLayout from "../../MainCategories/Vehicles/VehiclePostLayout";
import { db } from "../../../Components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const VehiclePostSidePanel = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 🔹 Get all posts where type == "vehicle"
        const postsRef = collection(db, "Posts");
        const q = query(postsRef, where("type", "==", "vehicle"));
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
    return <div className="event-post-side-panel">Loading vehicle posts...</div>;
  }

  return (
    <div className="event-post-side-panel">
      <div className="panel-title">Related Vehicle Posts</div>
      <div className="panel-posts">
        {posts.map((post) => (
          <VehiclePostLayout key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default VehiclePostSidePanel;
