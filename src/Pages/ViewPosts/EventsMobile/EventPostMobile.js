import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaStar,
  FaShareAlt,
  FaBookmark,
  FaFlag,
  FaArrowLeft,
  FaArrowRight,
  FaExpand,
  FaChevronLeft
} from "react-icons/fa";
import { db } from "../../../Components/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";

// Context & Hooks
import { useAuth } from "../../../AuthContext";

// Components
import PageHeader from "../../../Components/PageHeader";
import SellerRating from "../../../Components/Reviews/SellerRating";
import ViewPhotoOverlay from "../../../Components/Overlays/ViewPhotoOverlay";
import PostSectionReviews from "../../../Components/PostSectionReviews";
import PostDropMenu from "../../../Components/PostDropMenu";
import MainCommentsSection from "../../../Components/CommentsMobile/CommentsSectionMobile";
import PromotedPanel from "../../../Components/ViewPostsMobile/PromotedPanelMobile";
import BlockUserOverlay from "../../../Components/Overlays/BlockUserOverlay";
import DeletePostOverlay from "../../../Components/Overlays/DeletePostOverlay";
import GetPostRoute from "../../../Functions/GetPostRoute";
import useGetTimezoneDate from "../../../Hooks/useGetTimezoneDate";
import useGetTimezoneTime from "../../../Hooks/useGetTimezoneTime";

import "./EventPostMobile.css";

const EventPostMobile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // States
  const [post, setPost] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [notification, setNotification] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [reported, setReported] = useState(false);
  const [followed, setFollowed] = useState(false);
  
  // Overlay States
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayIndex, setOverlayIndex] = useState(0);
  const [showBlockUserOverlay, setShowBlockUserOverlay] = useState(false);
  const [showDeletePostOverlay, setShowDeletePostOverlay] = useState(false);

  const eventDate = useGetTimezoneDate(post?.eventDateTime, post?.timezone);
  const eventTime = useGetTimezoneTime(post?.eventDateTime, post?.timezone);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, "Posts", id);
        const postSnap = await getDoc(postRef);
        
        if (!postSnap.exists()) {
          navigate("/home");
          return;
        }

        const postData = postSnap.data();
        if (postData.type !== 'event') {
          const postRoute = GetPostRoute(postData.type);
          navigate(postRoute ? postRoute + id : "/home");
          return;
        }
        
        setPost(postData);

        // Fetch Seller
        const userRef = doc(db, "Users", postData.userId);
        const userSnap = await getDoc(userRef);
        setSeller(userSnap.exists() ? userSnap.data() : null);

        // Auth Checks
        if (currentUser) {
          const currentUserRef = doc(db, "Users", currentUser.uid);
          const currentUserSnap = await getDoc(currentUserRef);
          if (currentUserSnap.exists()) {
            setBookmarked(currentUserSnap.data().bookmarks?.includes(id) || false);
          }
          setReported(postData.report?.includes(currentUser.uid) || false);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, currentUser, navigate]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification("Link copied!");
  };

  const handleReport = async () => {
    if (!currentUser) return;
    const postRef = doc(db, "Posts", id);
    try {
      const postSnap = await getDoc(postRef);
      if (!postSnap.exists()) return;

      const postData = postSnap.data();
      const reportArray = postData.report || [];

      if (reportArray.includes(currentUser.uid)) {
        await updateDoc(postRef, { report: arrayRemove(currentUser.uid) });
        setReported(false);
        showNotification("Report removed");
      } else {
        await updateDoc(postRef, { report: arrayUnion(currentUser.uid) });
        setReported(true);
        showNotification("Reported");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async (id) => {
    try {
      // Delete the post from Firestore
      await deleteDoc(doc(db, "Posts", id));
      showNotification("Post deleted successfully!");
      setShowDeletePostOverlay(false);
      navigate("/"); // or redirect wherever
    } catch (err) {
      console.error("Error deleting post:", err);
      showNotification("Failed to delete post");
    }
  };

  if (loading) return <div className="epm-loader">Loading...</div>;
  if (!post) return null;

  const images = post.images?.length > 0 ? post.images : ["/default-thumbnail.png"];
  const isSeller = currentUser?.uid === post.userId;

  const formatLink = (url) =>
    url ? (url.startsWith("http") ? url : `https://${url}`) : null;

  return (
    <div className="epm-container">
      {notification && <div className="epm-toast">{notification}</div>}
      
      <PageHeader 
        title="Market Post" 
        backgroundUrl="https://res.cloudinary.com/dmjvngk3o/image/upload/v1770817699/71d90db6-3ded-4f1d-831d-61c8a2fc96be_sqmlwb.png" 
      />

      {/* Header Info */}
      <div className="epm-header-actions">
        <span className="epm-breadcrumb">VRUMIES / EVENTS</span>
        <PostDropMenu 
          canDelete={isSeller} 
          onDelete={() => setShowDeletePostOverlay(true)} 
          canBlock={!isSeller} 
          onBlock={() => setShowBlockUserOverlay(true)} 
          canReport={true}
          onReport={handleReport}
          reported={reported} 
        />
      </div>

      {/* Image Carousel */}
      <div className="epm-image-section">
        <div className="epm-main-image-wrapper">
          <img 
            src={images[currentImage]} 
            alt="Product" 
            className="epm-main-image"
            onClick={() => {
              setOverlayIndex(currentImage);
              setShowOverlay(true);
            }}
          />
          <div className="epm-image-counter">{currentImage + 1} / {images.length}</div>
        </div>
        <div className="epm-thumbnails">
          {images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              className={`epm-thumb ${idx === currentImage ? "active" : ""}`} 
              onClick={() => setCurrentImage(idx)}
              alt="thumb"
            />
          ))}
        </div>
      </div>

      {/* Content Body */}
      <div className="epm-body">
        <h1 className="epm-title">{post.title?.toUpperCase()}</h1>
        
        
        <div className="epm-seller-card">
          <Link to={`/viewprofilemobile/${post.userId}`}>
            <img src={seller?.profilepic || "/default-profile.png"} className="epm-seller-avatar" alt="seller" />
          </Link>
          <div className="epm-seller-info">
            <Link to={`/viewprofilemobile/${post.userId}`} className="epm-seller-name">{seller?.username}</Link>
            <SellerRating userId={post.userId} />
          </div>
          <button className={`epm-follow-btn ${followed ? 'active' : ''}`} onClick={() => setFollowed(!followed)}>
            {followed ? "Following" : "Follow"}
          </button>
        </div>

        {/* Tabs */}
        <div className="epm-tabs">
          {["description", "details", "reviews"].map(tab => (
            <div 
              key={tab}
              className={`epm-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="epm-tab-content">
          {activeTab === "description" && <p>{post.description}</p>}
          {activeTab === "details" && (
            <div className="epm-details-list">
              <p><strong>Tokens:</strong> {post.tokens ?? "N/A"}</p>
              <p><strong>Post Location:</strong> {post.location ?? "N/A"}</p>
              <p><strong>Link:</strong>{" "}
                {post.link ? (
                  <a href={formatLink(post.link)} target="_blank" rel="noopener noreferrer">
                    {post.link}
                  </a>
                ) : "N/A"}
              </p>
              <p><strong>Event Address:</strong> {post.eventAddress ?? "N/A"}</p>
              <p>
                <strong>Event Date:</strong>{" "}
                {eventDate || "N/A"}
              </p>
              <p>
                <strong>Event Time:</strong>{" "}
                {eventTime || "N/A"}
              </p>
            </div>
          )}
          {activeTab === "reviews" && <PostSectionReviews userId={post.userId} />}
        </div>

        {/* Action Grid */}
        <div className="epm-action-grid">
          <button className="epm-grid-btn" onClick={handleShare}><FaShareAlt /> Share</button>
          <button className={`epm-grid-btn ${bookmarked ? 'active' : ''}`}><FaBookmark /> Bookmark</button>
          <button className="epm-grid-btn"><FaFlag /> Report</button>
        </div>

        <hr className="epm-divider" />

        <div className="epm-comments-section">
          <h3>Comments</h3>
          <MainCommentsSection postId={id} />
        </div>

        <div className="epm-promoted-section">
          <h3>Promoted</h3>
          <PromotedPanel category="event" />
        </div>
      </div>

      {/* Overlays */}
      {showOverlay && (
        <ViewPhotoOverlay
          photos={images}
          startIndex={overlayIndex}
          caption={post.title}
          createdAt={post.createdAt}
          onClose={() => {
            setShowOverlay(false);
            setOverlayIndex(0);
          }}
        />
      )}
      {/* ... Other overlays follow same pattern ... */}
      {showBlockUserOverlay && (
        <BlockUserOverlay
          userId={post.userId}
          from="post"
          isOpen={showBlockUserOverlay}
          onClose={() => setShowBlockUserOverlay(false)}
        />
      )}
      {showDeletePostOverlay && (
        <DeletePostOverlay
          postId={id}
          isOpen={showDeletePostOverlay}
          onClose={() => setShowDeletePostOverlay(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default EventPostMobile;