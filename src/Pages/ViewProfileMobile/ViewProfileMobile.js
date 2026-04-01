import React, { useState, useEffect } from "react";
import "./ViewProfileMobile.css";
import { 
  FaVideo, FaPenFancy, FaCar, FaCalendarAlt, FaStore, 
  FaBook, FaClipboardList, FaTruck, FaListAlt, FaShareAlt 
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../../Components/firebase";
import { doc, getDoc, collection, query, where, getDocs, limit, setDoc, serverTimestamp } from "firebase/firestore";

// Hooks
import ProfileRating from "../../Components/Reviews/ProfileRating";
import { useFollow } from "../../Hooks/useFollow";
import useGetPhotos from "../../Hooks/useGetPhotos";
import useGetProfileCover from "../../Hooks/useGetProfileCover";
import useGetUserReviews from "../../Hooks/useGetUserReviews";
import useUserAverageRating from "../../Components/Reviews/useUserAverageRating";
import useUserTotalRatings from "../../Components/Reviews/useUserTotalRatings";
import useGetUserDisputes from "../../Hooks/useGetUserDisputes";
import useGetProfilePic from "../../Hooks/useGetProfilePic";

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
import ViewPhotoOverlay from "../../Components/Overlays/ViewPhotoOverlay";

// The fallback image from your desktop version
const RANDOM_COVER_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn1XCKLwfD23PmpBQSj0aQREfslkrQ53-jWQ&s";

const categoryMap = {
  videos: { label: "Videos", icon: <FaVideo />, Layout: VideosPostLayout, type: "video" },
  blogs: { label: "Blogs", icon: <FaPenFancy />, Layout: BlogPostLayout, type: "blog" },
  vehicles: { label: "Vehicles", icon: <FaCar />, Layout: VehiclePostLayout, type: "vehicle" },
  market: { label: "Market", icon: <FaStore />, Layout: MarketPostLayout, type: "market" },
  events: { label: "Events", icon: <FaCalendarAlt />, Layout: EventsPostLayout, type: "event" },
  directory: { label: "Directory", icon: <FaBook />, Layout: DirectoryPostLayout, type: "directory" },
  requests: { label: "Requests", icon: <FaListAlt />, Layout: RequestPostLayout, type: "request" },
  loads: { label: "Loads", icon: <FaClipboardList />, Layout: LoadPostLayout, type: "loads" },
  trucks: { label: "Trucks", icon: <FaTruck />, Layout: TruckPostLayout, type: "trucks" },
};

export default function ViewProfileMobile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedCategory, setSelectedCategory] = useState("videos");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Data Hooks
  const { isFollowing, toggleFollow } = useFollow(userId);
  const { photos: userPhotos } = useGetPhotos(userId);
  const dbCoverPhoto = useGetProfileCover(userId);
  const profilePic = useGetProfilePic(userId);
  const { reviews } = useGetUserReviews(userId);
  const averageRating = useUserAverageRating(userId);
  const totalRatings = useUserTotalRatings(userId);
  const disputes = useGetUserDisputes(userId);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const docRef = doc(db, "Users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (activeTab === "posts" && userId) {
      const fetchPosts = async () => {
        setLoadingPosts(true);
        try {
          const q = query(
            collection(db, "Posts"),
            where("userId", "==", userId),
            where("type", "==", categoryMap[selectedCategory].type),
            limit(12)
          );
          const snap = await getDocs(q);
          setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
          console.error("Error fetching posts:", err);
        }
        setLoadingPosts(false);
      };
      fetchPosts();
    }
  }, [userId, activeTab, selectedCategory]);

  const handleMessage = async () => {
    if (!auth.currentUser) return navigate("/login");
    try {
      const chatId = [auth.currentUser.uid, userId].sort().join("_");
      await setDoc(doc(db, "Chats", chatId), {
        participants: [auth.currentUser.uid, userId],
        lastUpdated: serverTimestamp()
      }, { merge: true });
      navigate(`/messages/${chatId}`);
    } catch (err) {
      console.error("Error starting chat:", err);
    }
  };

  const handleShare = () => {
    const profileUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${userData?.username}'s Profile`,
        url: profileUrl,
      });
    } else {
      navigator.clipboard.writeText(profileUrl);
      alert("Profile link copied to clipboard!");
    }
  };

  if (loading) return <div className="vpm-loading">Loading Profile...</div>;

  return (
    <div className="vpm-container">
      {/* 1. COVER PHOTO WITH FALLBACK */}
      <div 
        className="vpm-cover-wrapper" 
        style={{ backgroundImage: `url(${dbCoverPhoto || RANDOM_COVER_URL})` }}
      >
        <div className="vpm-cover-overlay" />
      </div>

      {/* 2. PROFILE HEADER */}
      <div className="vpm-header-card">
        <div className="vpm-avatar-container">
          <img 
            src={profilePic} 
            alt="Profile" 
            className="vpm-avatar" 
          />
        </div>
        
        <h2 className="vpm-username">{userData?.username || "User"}</h2>
        <p className="vpm-email">{userData?.email}</p>
        
        <div className="vpm-rating-row">
          <ProfileRating userId={userId} />
        </div>
        
        {/* ACTION BUTTONS - NOW STACKED VERTICALLY */}
        <div className="vpm-action-buttons-stacked">
          <button className={`vpm-btn-wide vpm-follow-btn ${isFollowing ? 'following' : ''}`} onClick={toggleFollow}>
            {isFollowing ? "Following" : "Follow"}
          </button>
          <button className="vpm-btn-wide vpm-message-btn" onClick={handleMessage}>
            Message Me
          </button>
          <button className="vpm-btn-wide vpm-share-btn-wide" onClick={handleShare}>
            <FaShareAlt style={{ marginRight: '8px' }} /> Share Profile
          </button>
        </div>

        {/* ABOUT ME SECTION */}
        <div className="vpm-about-section">
          <div className="vpm-about-header">About me</div>
          <p className="vpm-about-text">
            {userData?.aboutme || "No bio provided."}
          </p>
        </div>
      </div>

      {/* TABS - Added top margin in CSS for spacing */}
      <div className="vpm-tabs">
        {["posts", "photos", "reviews"].map(tab => (
          <button 
            key={tab} 
            className={`vpm-tab-btn ${activeTab === tab ? "active" : ""}`} 
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="vpm-content-area">
        {activeTab === "posts" && (
          <>
            {/* CATEGORY SCROLLER - CENTERED VIA CSS */}
            <div className="vpm-category-scroller">
              {Object.keys(categoryMap).map(catId => (
                <button
                  key={catId}
                  className={`vpm-cat-btn ${selectedCategory === catId ? "selected" : ""}`}
                  onClick={() => setSelectedCategory(catId)}
                >
                  <div className="vpm-cat-icon">
                    {categoryMap[catId].icon}
                  </div>

                  <div className="vpm-cat-text">
                    {categoryMap[catId].label}
                  </div>
                </button>
              ))}
            </div>
            <div className="vpm-post-list">
              {loadingPosts ? (
                <p className="vpm-no-data">Loading posts...</p>
              ) : posts.length === 0 ? (
                <p className="vpm-no-data">No {selectedCategory} posts yet.</p>
              ) : (
                posts.map(post => {
                  const { Layout } = categoryMap[selectedCategory];
                  return <Layout key={post.id} {...post} />;
                })
              )}
            </div>
          </>
        )}

        {activeTab === "photos" && (
          <div className="vpm-photos-grid">
            {userPhotos.length === 0 ? (
              <p className="vpm-no-data">No photos yet.</p>
            ) : (
              userPhotos.map(photo => (
                <div key={photo.id} className="vpm-photo-card" onClick={() => setSelectedPhoto(photo.photoUrl)}>
                  <img src={photo.photoUrl} alt="" />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="vpm-reviews-section">
            <div className="vpm-review-summary-container">
              <div className="vpm-sum-box">
                <div className="vpm-sum-val">{Number(averageRating || 0).toFixed(1)} ⭐</div>
                <div className="vpm-sum-lbl">Average</div>
              </div>
              <div className="vpm-sum-box">
                <div className="vpm-sum-val">{totalRatings || 0}</div>
                <div className="vpm-sum-lbl">Total</div>
              </div>
              <div className="vpm-sum-box">
                <div className="vpm-sum-val">{disputes || 0}</div>
                <div className="vpm-sum-lbl">Disputes</div>
              </div>
            </div>

            <div className="vpm-reviews-list">
              {reviews.length === 0 ? (
                <p className="vpm-no-data">No reviews yet.</p>
              ) : (
                reviews.map(rev => (
                  <div key={rev.id} className="vpm-rev-card">
                    <div className="vpm-rev-header">
                      <img src={rev.userPhoto || "https://via.placeholder.com/50"} alt="" className="vpm-rev-avatar" />
                      <div className="vpm-rev-info">
                        <span className="vpm-rev-name">{rev.userName}</span>
                        <span className="vpm-rev-date">{rev.date}</span>
                      </div>
                      <div className="vpm-rev-stars">{"★".repeat(rev.rating)}</div>
                    </div>
                    <p className="vpm-rev-text">{rev.reviewText}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {selectedPhoto && <ViewPhotoOverlay photoUrl={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </div>
  );
}