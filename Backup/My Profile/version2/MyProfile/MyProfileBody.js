import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../../Components/firebase";
import "./MyProfileBody.css";

// Import all post layouts
import VideosPostLayout from "../MainCategories/Videos/VideosPostLayout";
import BlogPostLayout from "../MainCategories/Blogs/BlogPostLayout";
import VehiclePostLayout from "../MainCategories/Vehicles/VehiclePostLayout";
import MarketPostLayout from "../MainCategories/Market/MarketPostLayout";
import EventsPostLayout from "../MainCategories/Events/EventsPostLayout";
import DirectoryPostLayout from "../MainCategories/Directory/DirectoryPostLayout";
import RequestPostLayout from "../MainCategories/Requests/RequestPostLayout";
import LoadPostLayout from "../MainCategories/Loads/LoadPostLayout";
import TruckPostLayout from "../MainCategories/Trucks/TruckPostLayout";

// Map selectedCategory ID to Firestore type
const categoryTypeMap = {
  videos: "video",
  blogs: "blog",
  vehicles: "vehicle",
  events: "event",
  market: "market",
  directory: "directory",
  requests: "request",
  loads: "loads",
  trucks: "trucks",
};

// Map selectedCategory ID to Layout and label
const categoryMap = {
  videos: { Layout: VideosPostLayout, label: "Videos" },
  blogs: { Layout: BlogPostLayout, label: "Blogs" },
  vehicles: { Layout: VehiclePostLayout, label: "Vehicles" },
  events: { Layout: EventsPostLayout, label: "Events" },
  market: { Layout: MarketPostLayout, label: "Market" },
  directory: { Layout: DirectoryPostLayout, label: "Directory" },
  requests: { Layout: RequestPostLayout, label: "Requests" },
  loads: { Layout: LoadPostLayout, label: "Loads" },
  trucks: { Layout: TruckPostLayout, label: "Trucks" },
};

export default function MyProfileBody({ selectedCategory }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedCategory) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const typeForQuery = categoryTypeMap[selectedCategory];
        const collectionRef = collection(db, "Posts");
        const q = query(collectionRef, where("type", "==", typeForQuery), limit(16));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [selectedCategory]);

  const { Layout, label } = categoryMap[selectedCategory] || {};

  return (
    <div className="my-profile-body">
      {selectedCategory ? (
        <>
          <h2 className="profile-body-title">{label}</h2>
          {loading ? (
            <div className="no-posts-message">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="no-posts-message">No posts found in this category.</div>
          ) : (
            <div className="post-grid">
              {posts.map((post) => (
                <Layout key={post.id} {...post} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="no-posts-message">Select a category to view posts.</div>
      )}
    </div>
  );
}
