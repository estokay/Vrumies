import React, { useState, useEffect, useRef } from "react";
import "./MyProfileMobile.css";
import { FaStar, FaPen, FaCamera, FaExpand, FaTrash, FaVideo, FaPenFancy, FaCar, FaCalendarAlt, FaStore, FaBook, FaClipboardList, FaTruck, FaListAlt } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../Components/firebase";
import { doc, getDoc, updateDoc, collection, getDocs, query, where, limit } from "firebase/firestore";
import axios from "axios";
import { CLOUDINARY_CONFIG } from "../../Components/config";

// Custom Hooks & Components from your original files
import ProfileRating from "../../Components/Reviews/ProfileRating";
import useGetPhotos from "../../Hooks/useGetPhotos";
import useDeletePhoto from "../../Hooks/useDeletePhoto";
import useGetProfileCover from "../../Hooks/useGetProfileCover";
import useUploadToCloudinary from "../../Hooks/useUploadToCloudinary";
import useChangeCoverPhoto from "../../Hooks/useChangeCoverPhoto";
import useGetUserReviews from "../../Hooks/useGetUserReviews";
import useUserAverageRating from "../../Components/Reviews/useUserAverageRating";
import useUserTotalRatings from "../../Components/Reviews/useUserTotalRatings";
import useGetProfilePic from "../../Hooks/useGetProfilePic";

// Layouts for Posts
import VideosPostLayout from "../MainCategories/Videos/VideosPostLayout";
import BlogPostLayout from "../MainCategories/Blogs/BlogPostLayout";
import VehiclePostLayout from "../MainCategories/Vehicles/VehiclePostLayout";
import MarketPostLayout from "../MainCategories/Market/MarketPostLayout";
import EventsPostLayout from "../MainCategories/Events/EventsPostLayout";
import DirectoryPostLayout from "../MainCategories/Directory/DirectoryPostLayout";
import RequestPostLayout from "../MainCategories/Requests/RequestPostLayout";
import LoadPostLayout from "../MainCategories/Loads/LoadPostLayout";
import TruckPostLayout from "../MainCategories/Trucks/TruckPostLayout";

const categoryTypeMap = {
  videos: "video", blogs: "blog", vehicles: "vehicle", events: "event",
  market: "market", directory: "directory", requests: "request", loads: "loads", trucks: "trucks",
};

const categoryMap = {
  videos: { Layout: VideosPostLayout, label: "Videos", icon: <FaVideo /> },
  blogs: { Layout: BlogPostLayout, label: "Blogs", icon: <FaPenFancy /> },
  vehicles: { Layout: VehiclePostLayout, label: "Vehicles", icon: <FaCar /> },
  events: { Layout: EventsPostLayout, label: "Events", icon: <FaCalendarAlt /> },
  market: { Layout: MarketPostLayout, label: "Market", icon: <FaStore /> },
  directory: { Layout: DirectoryPostLayout, label: "Directory", icon: <FaBook /> },
  requests: { Layout: RequestPostLayout, label: "Requests", icon: <FaListAlt /> },
  loads: { Layout: LoadPostLayout, label: "Loads", icon: <FaClipboardList /> },
  trucks: { Layout: TruckPostLayout, label: "Trucks", icon: <FaTruck /> },
};

export default function MyProfileMobile() {
  const [activeTab, setActiveTab] = useState("posts"); // posts, photos, reviews
  const [selectedCategory, setSelectedCategory] = useState("videos");
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const profilePic = useGetProfilePic(userId);

  // Profile logic
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        setUserId(user.uid);
        const userSnap = await getDoc(doc(db, "Users", user.uid));
        if (userSnap.exists()) setUserData(userSnap.data());
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Posts logic
  useEffect(() => {
    if (!userId || activeTab !== "posts") return;
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const q = query(collection(db, "Posts"), 
          where("type", "==", categoryTypeMap[selectedCategory]), 
          where("userId", "==", userId), limit(10));
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) { console.error(err); }
      setLoadingPosts(false);
    };
    fetchPosts();
  }, [selectedCategory, userId, activeTab]);

  const { photos: userPhotos } = useGetPhotos(userId); //
  const { reviews } = useGetUserReviews(userId); //

  return (
    <div className="mob-profile-container">
      {/* Header Section: Avatar and Bio */}
      <div className="mob-header-card">
        <div className="mob-avatar-wrapper">
          <img src={profilePic || `${process.env.PUBLIC_URL}/default-profile.png`} alt="Profile" className="mob-avatar-img" />
        </div>
        <h2 className="mob-username">{userData?.username || "Loading..."}</h2>
        <p className="mob-user-email">{userData?.email || "No email provided"}</p>
        <p className="mob-bio">{userData?.aboutme || "No bio yet."}</p>
        <div className="mob-stats-row">
            <ProfileRating userId={userId} />
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="mob-main-tabs">
        {["posts", "photos", "reviews"].map(tab => (
          <button key={tab} className={`mob-tab-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Conditional Content Rendering */}
      <div className="mob-content-body">
        {activeTab === "posts" && (
          <>
            <div className="mob-category-grid">
              {Object.keys(categoryMap).map(catId => (
                <button key={catId} className={`mob-cat-icon-btn ${selectedCategory === catId ? "selected" : ""}`} onClick={() => setSelectedCategory(catId)}>
                  {categoryMap[catId].icon}
                </button>
              ))}
            </div>
            <div className="mob-post-list">
              {loadingPosts ? <p>Loading posts...</p> : posts.map(post => {
                const { Layout } = categoryMap[selectedCategory];
                return <Layout key={post.id} {...post} />;
              })}
            </div>
          </>
        )}

        {activeTab === "photos" && (
          <div className="mob-photo-grid">
            {userPhotos.map(photo => (
              <div key={photo.id} className="mob-photo-item">
                <img src={photo.photoUrl} alt="User" />
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="mob-review-list">
            {reviews.map(review => (
              <div key={review.id} className="mob-review-card">
                <div className="mob-review-header">
                  <span className="mob-reviewer-name">{review.userName}</span>
                  <span className="mob-review-stars">{"★".repeat(review.rating)}</span>
                </div>
                <p className="mob-review-text">{review.reviewText}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}