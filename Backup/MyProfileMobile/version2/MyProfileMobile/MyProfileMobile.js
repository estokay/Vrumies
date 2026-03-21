import React, { useState, useEffect, useRef } from "react";
import "./MyProfileMobile.css";
import { 
  FaCamera, FaTrash, FaVideo, FaPenFancy, FaCar, 
  FaCalendarAlt, FaStore, FaBook, FaClipboardList, 
  FaTruck, FaListAlt, FaPlus 
} from "react-icons/fa";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../Components/firebase";
import { doc, getDoc, collection, getDocs, query, where, limit, updateDoc } from "firebase/firestore";

// Hooks & Components
import ProfileRating from "../../Components/Reviews/ProfileRating";
import useGetPhotos from "../../Hooks/useGetPhotos";
import useDeletePhoto from "../../Hooks/useDeletePhoto";
import useGetProfileCover from "../../Hooks/useGetProfileCover";
import useUploadToCloudinary from "../../Hooks/useUploadToCloudinary";
import useChangeCoverPhoto from "../../Hooks/useChangeCoverPhoto";
import useGetUserReviews from "../../Hooks/useGetUserReviews";
import useGetProfilePic from "../../Hooks/useGetProfilePic";
import UploadPhotoOverlay from "../../Components/Overlays/UploadPhotoOverlay";

// Post Layouts
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
  videos: { Layout: VideosPostLayout, icon: <FaVideo /> },
  blogs: { Layout: BlogPostLayout, icon: <FaPenFancy /> },
  vehicles: { Layout: VehiclePostLayout, icon: <FaCar /> },
  events: { Layout: EventsPostLayout, icon: <FaCalendarAlt /> },
  market: { Layout: MarketPostLayout, icon: <FaStore /> },
  directory: { Layout: DirectoryPostLayout, icon: <FaBook /> },
  requests: { Layout: RequestPostLayout, icon: <FaListAlt /> },
  loads: { Layout: LoadPostLayout, icon: <FaClipboardList /> },
  trucks: { Layout: TruckPostLayout, icon: <FaTruck /> },
};

export default function MyProfileMobile() {
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedCategory, setSelectedCategory] = useState("videos");
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [uploadOverlayOpen, setUploadOverlayOpen] = useState(false);
  const [cacheKey, setCacheKey] = useState(Date.now());

  const fileInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const profilePic = useGetProfilePic(userId);
  const dbCoverPhoto = useGetProfileCover(userId);
  const { photos: userPhotos } = useGetPhotos(userId);
  const { reviews } = useGetUserReviews(userId);
  const { deletePhoto } = useDeletePhoto();
  const { uploadImage, loading: uploading } = useUploadToCloudinary();
  const { changeCoverPhoto } = useChangeCoverPhoto();

  // Auth & User Data
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

  // Fetch Posts Logic
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
      } catch (err) { console.error("Error fetching posts:", err); }
      setLoadingPosts(false);
    };
    fetchPosts();
  }, [selectedCategory, userId, activeTab]);

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;
    const url = await uploadImage(file);
    if (url) await changeCoverPhoto(userId, url);
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;
    const url = await uploadImage(file);
    if (url) {
      await updateDoc(doc(db, "Users", userId), { profilePic: url });
      setCacheKey(Date.now());
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (window.confirm("Delete this photo?")) {
      await deletePhoto(userId, photoId);
    }
  };

  return (
    <div className="mob-profile-container">
      {/* Cover Photo */}
      <div className="mob-cover-wrapper" style={{ backgroundImage: `url(${dbCoverPhoto || ''})`, backgroundColor: '#222' }}>
        <button className="mob-edit-cover-btn" onClick={() => fileInputRef.current.click()}>
          <FaCamera /> {uploading ? "..." : "Change Cover"}
        </button>
        <input type="file" ref={fileInputRef} onChange={handleCoverChange} hidden accept="image/*" />
      </div>

      <div className="mob-header-card">
        <div className="mob-avatar-container">
          <div className="mob-avatar-wrapper">
             <img src={profilePic ? `${profilePic}?v=${cacheKey}` : `${process.env.PUBLIC_URL}/default-profile.png`} alt="Profile" className="mob-avatar-img" />
             <div className="mob-avatar-edit-overlay" onClick={() => profileInputRef.current.click()}>
                <FaCamera />
             </div>
             <input type="file" ref={profileInputRef} onChange={handleProfilePicChange} hidden accept="image/*" />
          </div>
        </div>
        
        <h2 className="mob-username">{userData?.username || "Loading..."}</h2>
        <p className="mob-user-email">{userData?.email}</p>
        
        <div className="mob-stats-row">
            <ProfileRating userId={userId} />
        </div>
        <p className="mob-bio">{userData?.aboutme || "No bio yet."}</p>
      </div>

      <div className="mob-main-tabs">
        {["posts", "photos", "reviews"].map(tab => (
          <button key={tab} className={`mob-tab-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mob-content-body">
        {/* POSTS TAB */}
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
              {loadingPosts ? <p>Loading posts...</p> : posts.length === 0 ? <p className="mob-empty-msg">No posts in this category.</p> : posts.map(post => {
                const { Layout } = categoryMap[selectedCategory];
                return <Layout key={post.id} {...post} />;
              })}
            </div>
          </>
        )}

        {/* PHOTOS TAB */}
        {activeTab === "photos" && (
          <div className="mob-photo-section">
            <button className="mob-upload-box" onClick={() => setUploadOverlayOpen(true)}>
              <FaPlus /> <span>Upload Photo</span>
            </button>
            <div className="mob-photo-grid">
              {userPhotos.map(photo => (
                <div key={photo.id} className="mob-photo-item">
                  <img src={photo.photoUrl} alt="User upload" />
                  <button className="mob-photo-delete-btn" onClick={() => handleDeletePhoto(photo.id)}>
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="mob-review-list">
            {reviews.length === 0 ? <p className="mob-empty-msg">No reviews yet.</p> : reviews.map(review => (
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

      {uploadOverlayOpen && (
        <UploadPhotoOverlay 
          onClose={() => setUploadOverlayOpen(false)} 
          onUploadComplete={() => setUploadOverlayOpen(false)} 
        />
      )}
    </div>
  );
}