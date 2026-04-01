import React, { useState, useEffect, useRef } from "react";
import "./MyProfileMobile.css";
import { 
  FaStar, FaPen, FaCamera, FaExpand, FaTrash, FaVideo, 
  FaPenFancy, FaCar, FaCalendarAlt, FaStore, FaBook, 
  FaClipboardList, FaTruck, FaListAlt, FaTimes, FaCheck, FaShareAlt 
} from "react-icons/fa";
import { db, auth } from "../../Components/firebase";
import { doc, getDoc, updateDoc, collection, getDocs, query, where, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Custom Hooks & Components
import ProfileRating from "../../Components/Reviews/ProfileRating";
import useGetPhotos from "../../Hooks/useGetPhotos";
import useGetProfileCover from "../../Hooks/useGetProfileCover";
import useUploadToCloudinary from "../../Hooks/useUploadToCloudinary";
import useChangeCoverPhoto from "../../Hooks/useChangeCoverPhoto";
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

const categoryMap = {
  videos: { label: "Videos", Layout: VideosPostLayout, icon: <FaVideo /> },
  blogs: { label: "Blogs", Layout: BlogPostLayout, icon: <FaPenFancy /> },
  vehicles: { label: "Vehicles", Layout: VehiclePostLayout, icon: <FaCar /> },
  events: { label: "Events", Layout: EventsPostLayout, icon: <FaCalendarAlt /> },
  market: { label: "Market", Layout: MarketPostLayout, icon: <FaStore /> },
  directory: { label: "Directory", Layout: DirectoryPostLayout, icon: <FaBook /> },
  requests: { label: "Requests", Layout: RequestPostLayout, icon: <FaListAlt /> },
  loads: { label: "Loads", Layout: LoadPostLayout, icon: <FaClipboardList /> },
  trucks: { label: "Trucks", Layout: TruckPostLayout, icon: <FaTruck /> },
};

export default function MyProfileMobile() {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedCategory, setSelectedCategory] = useState("videos");
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  
  // Refs
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  // Edit States
  const [editingUsername, setEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [editingAbout, setEditingAbout] = useState(false);
  const [tempAbout, setTempAbout] = useState("");

  const user = auth.currentUser;
  const userId = user?.uid;

  // Data Hooks
  const { photos: userPhotos } = useGetPhotos(userId);
  const dbCoverPhoto = useGetProfileCover(userId);
  const { uploadImage, loading: uploadingFile } = useUploadToCloudinary();
  const { changeCoverPhoto } = useChangeCoverPhoto();
  const { reviews } = useGetUserReviews(userId);
  const averageRating = useUserAverageRating(userId);
  const totalRatings = useUserTotalRatings(userId);
  const disputes = useGetUserDisputes(userId);
  const profilePic = useGetProfilePic(userId);

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        const snap = await getDoc(doc(db, "Users", userId));
        if (snap.exists()) {
          const data = snap.data();
          setUserData(data);
          setTempUsername(data.username || "");
          setTempAbout(data.aboutme || "");
        }
      };
      fetchUser();
    }
  }, [userId]);

  useEffect(() => {
    if (userId && activeTab === "posts") {
      const fetchPosts = async () => {
        setLoadingPosts(true);
        try {
          const q = query(
            collection(db, "Posts"),
            where("type", "==", categoryTypeMap[selectedCategory]),
            where("userId", "==", userId),
            limit(10)
          );
          const snap = await getDocs(q);
          setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) { console.error(err); }
        setLoadingPosts(false);
      };
      fetchPosts();
    }
  }, [userId, selectedCategory, activeTab]);

  const handleSaveUsername = async () => {
    await updateDoc(doc(db, "Users", userId), { username: tempUsername });
    setUserData({ ...userData, username: tempUsername });
    setEditingUsername(false);
  };

  const handleSaveAbout = async () => {
    await updateDoc(doc(db, "Users", userId), { aboutme: tempAbout });
    setUserData({ ...userData, aboutme: tempAbout });
    setEditingAbout(false);
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) await changeCoverPhoto(userId, url);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) {
        await updateDoc(doc(db, "Users", userId), { photoURL: url });
      }
    }
  };

  const handleShareProfile = async () => {
    const shareData = {
      title: `${userData?.username}'s Profile`,
      text: `Check out ${userData?.username}'s profile on our platform!`,
      url: window.location.href, 
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Profile link copied to clipboard!");
    }
  };

  return (
    <div className="mob-profile-container">
      <div className="mob-cover-wrapper" style={{ backgroundImage: `url(${dbCoverPhoto || ""})` }}>
        <button className="mob-edit-cover-btn" onClick={() => coverInputRef.current.click()}>
          <FaCamera /> {uploadingFile ? "..." : "Change Cover"}
        </button>
        <input type="file" ref={coverInputRef} hidden onChange={handleCoverChange} />
      </div>

      <div className="mob-header-card">
        <div className="mob-avatar-container">
          <div className="mob-avatar-wrapper">
            <img src={profilePic} className="mob-avatar-img" alt="Profile" />
            <button className="mob-avatar-edit-badge" onClick={() => profileInputRef.current.click()}>
              <FaCamera />
            </button>
            <input type="file" ref={profileInputRef} hidden onChange={handleProfilePicChange} />
          </div>
        </div>

        {editingUsername ? (
          <div className="mob-edit-input-wrapper">
            <input className="mob-edit-input" value={tempUsername} onChange={(e) => setTempUsername(e.target.value)} />
            <button className="mob-save-btn" onClick={handleSaveUsername}><FaCheck /></button>
            <button className="mob-cancel-btn" onClick={() => { setEditingUsername(false); setTempUsername(userData.username); }}><FaTimes /></button>
          </div>
        ) : (
          <div className="mob-username-row">
            <h1 className="mob-username" onClick={() => setEditingUsername(true)}>{userData?.username || "Loading..."}</h1>
            <FaPen className="mob-edit-icon-small" onClick={() => setEditingUsername(true)} />
          </div>
        )}
        <p className="mob-user-email">{user?.email}</p>

        <div className="mob-rating-row">
          <ProfileRating userId={userId} />
        </div>

        <button className="mob-btn-wide mob-share-btn-wide" onClick={handleShareProfile}>
          <FaShareAlt style={{ marginRight: "8px" }} /> Share Profile
        </button>
        
        {editingAbout ? (
          <div className="mob-edit-input-wrapper-col">
            <textarea className="mob-edit-textarea" value={tempAbout} onChange={(e) => setTempAbout(e.target.value)} />
            <div className="mob-edit-actions">
              <button className="mob-save-btn" onClick={handleSaveAbout}>Save</button>
              <button className="mob-cancel-btn" onClick={() => { setEditingAbout(false); setTempAbout(userData.aboutme); }}>Cancel</button>
            </div>
          </div>
        ) : (
          <p className="mob-about-text" onClick={() => setEditingAbout(true)}>
            {userData?.aboutme || "Add a bio..."} <FaPen className="mob-edit-icon-tiny" />
          </p>
        )}
      </div>

      <div className="mob-tabs-row">
        {["posts", "photos", "reviews"].map(tab => (
          <button key={tab} className={`mob-tab-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mob-content-area">
        {activeTab === "posts" && (
          <>
            <div className="mob-categories-strip">
              {Object.keys(categoryMap).map(catId => (
                <button
                  key={catId}
                  className={`mob-cat-icon-btn ${selectedCategory === catId ? "selected" : ""}`}
                  onClick={() => setSelectedCategory(catId)}
                >
                  <div className="mob-cat-icon">
                    {categoryMap[catId].icon}
                  </div>

                  <div className="mob-cat-label">
                    {categoryMap[catId].label}
                  </div>
                </button>
              ))}
            </div>
            <div className="mob-post-list">
              {loadingPosts ? <p>Loading...</p> : posts.length === 0 ? <p className="mob-empty-msg">No posts yet.</p> : posts.map(post => {
                const { Layout } = categoryMap[selectedCategory];
                return <Layout key={post.id} {...post} />;
              })}
            </div>
          </>
        )}

        {activeTab === "photos" && (
          <div className="mob-photo-grid">
            {userPhotos.length === 0 ? <p className="mob-empty-msg">No photos yet.</p> : userPhotos.map(photo => (
              <div key={photo.id} className="mob-photo-item">
                <img src={photo.photoUrl} alt="User" />
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="mob-reviews-wrapper">
            <div className="mob-review-summary-container">
              <div className="mob-sum-box">
                <div className="mob-sum-val">{Number(averageRating || 0).toFixed(1)} ⭐</div>
                <div className="mob-sum-lbl">Average</div>
              </div>
              <div className="mob-sum-box">
                <div className="mob-sum-val">{totalRatings || 0}</div>
                <div className="mob-sum-lbl">Total</div>
              </div>
              <div className="mob-sum-box">
                <div className="mob-sum-val">{disputes || 0}</div>
                <div className="mob-sum-lbl">Disputes</div>
              </div>
            </div>
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
          </div>
        )}
      </div>
    </div>
  );
}