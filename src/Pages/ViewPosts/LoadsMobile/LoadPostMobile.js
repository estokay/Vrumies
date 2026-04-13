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
import { useCheckForAffiliateLink } from "../../../Hooks/useCheckForAffiliateLink";
import useIsItemInCart from "../../../Hooks/useIsItemInCart";
import useERPMwithTolls from "../../../CloudFunctions/useERPMwithTolls";
import useERPMwithoutTolls from "../../../CloudFunctions/useERPMwithoutTolls";
import useTimestampObjectToDate from "../../../Hooks/useTimestampObjectToDate";

// Components
import PageHeader from "../../../Components/PageHeader";
import SellerRating from "../../../Components/Reviews/SellerRating";
import ViewPhotoOverlay from "../../../Components/Overlays/ViewPhotoOverlay";
import PostSectionReviews from "../../../Components/PostSectionReviews";
import PostDropMenu from "../../../Components/PostDropMenu";
import ItemInCartOverlay from "../../../Components/Overlays/ItemInCartOverlay";
import MainCommentsSection from "../../../Components/CommentsMobile/CommentsSectionMobile";
import PromotedPanel from "../../../Components/ViewPostsMobile/PromotedPanelMobile";
import CreateAffiliateLinkOverlay from "../../../Components/Overlays/CreateAffiliateLinkOverlay";
import BlockUserOverlay from "../../../Components/Overlays/BlockUserOverlay";
import DeletePostOverlay from "../../../Components/Overlays/DeletePostOverlay";
import GetPostRoute from "../../../Functions/GetPostRoute";

import "./LoadPostMobile.css";

const LoadPostMobile = () => {
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
  const [overlayImage, setOverlayImage] = useState(null);
  const [showCartOverlay, setShowCartOverlay] = useState(false);
  const [showAffiliateLinkOverlay, setShowAffiliateLinkOverlay] = useState(false);
  const [showBlockUserOverlay, setShowBlockUserOverlay] = useState(false);
  const [showDeletePostOverlay, setShowDeletePostOverlay] = useState(false);

  const { affiliateDocId: affiliateLinkId } = useCheckForAffiliateLink(post?.userId);
  const { isInCart } = useIsItemInCart(id);

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
        if (postData.type !== 'loads') {
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

  const handleAddToCart = async () => {
    if (!currentUser) return alert("Login required");
    try {
      const itemRef = doc(db, "Users", currentUser.uid, "cart", id);
      await setDoc(itemRef, {
        postId: id,
        title: post.title,
        price: post.price,
        sellerId: post.userId,
        image: post.images?.[0],
        addedAt: new Date(),
      });
      setShowCartOverlay(true);
    } catch (err) { console.error(err); }
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

  const eRPMwithTolls = useERPMwithTolls(
    post?.pickupAddress || "",
    post?.dropoffAddress || "",
    post?.payout || 0
  );
  
  const eRPMwithoutTolls = useERPMwithoutTolls(
    post?.pickupAddress || "",
    post?.dropoffAddress || "",
    post?.payout || 0
  );
    
  const formattedAvailableDate = useTimestampObjectToDate(post?.availableDate);

  if (loading) return <div className="lpm-loader">Loading...</div>;
  if (!post) return null;

  const images = post.images?.length > 0 ? post.images : ["/default-thumbnail.png"];
  const isSeller = currentUser?.uid === post.userId;

  const formatLink = (url) =>
    url ? (url.startsWith("http") ? url : `https://${url}`) : null;

  return (
    <div className="lpm-container">
      {notification && <div className="lpm-toast">{notification}</div>}
      
      <PageHeader 
        title="Market Post" 
        backgroundUrl="https://res.cloudinary.com/dmjvngk3o/image/upload/v1770817699/71d90db6-3ded-4f1d-831d-61c8a2fc96be_sqmlwb.png" 
      />

      {/* Header Info */}
      <div className="lpm-header-actions">
        <span className="lpm-breadcrumb">VRUMIES / LOADS</span>
        <PostDropMenu 
          canDelete={isSeller} 
          onDelete={() => setShowDeletePostOverlay(true)} 
          canBlock={!isSeller} 
          onBlock={() => setShowBlockUserOverlay(true)} 
          canAffiliate={!isSeller} 
          onAffiliate={() => setShowAffiliateLinkOverlay(true)}
          canReport={true}
          onReport={handleReport}
          reported={reported} 
        />
      </div>

      {/* Image Carousel */}
      <div className="lpm-image-section">
        <div className="lpm-main-image-wrapper">
          <img 
            src={images[currentImage]} 
            alt="Product" 
            className="lpm-main-image"
            onClick={() => { setOverlayImage(images[currentImage]); setShowOverlay(true); }}
          />
          <div className="lpm-image-counter">{currentImage + 1} / {images.length}</div>
        </div>
        <div className="lpm-thumbnails">
          {images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              className={`lpm-thumb ${idx === currentImage ? "active" : ""}`} 
              onClick={() => setCurrentImage(idx)}
              alt="thumb"
            />
          ))}
        </div>
      </div>

      {/* Content Body */}
      <div className="lpm-body">
        <h1 className="lpm-title">{post.title?.toUpperCase()}</h1>
        <div className="lpm-price-tag">
          {post.price !== undefined
            ? `Payout: $${post.price.toFixed(2)}`
            : "Payout N/A"}
        </div>
        
        <div className="lpm-seller-card">
          <Link to={`/viewprofile/${post.userId}`}>
            <img src={seller?.profilepic || "/default-profile.png"} className="lpm-seller-avatar" alt="seller" />
          </Link>
          <div className="lpm-seller-info">
            <Link to={`/viewprofile/${post.userId}`} className="lpm-seller-name">{seller?.username}</Link>
            <SellerRating userId={post.userId} />
          </div>
          <button className={`lpm-follow-btn ${followed ? 'active' : ''}`} onClick={() => setFollowed(!followed)}>
            {followed ? "Following" : "Follow"}
          </button>
        </div>

        {/* Tabs */}
        <div className="lpm-tabs">
          {["description", "details", "reviews"].map(tab => (
            <div 
              key={tab}
              className={`lpm-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="lpm-tab-content">
          {activeTab === "description" && <p>{post.description}</p>}
          {activeTab === "details" && (
            <div className="lpm-details-list">
              <p><strong>Tokens:</strong> {post.tokens ?? "N/A"}</p>
              <p><strong>Post Location:</strong> {post.location ?? "N/A"}</p>
              <p><strong>Link:</strong>{" "}
                {post.link ? (
                  <a href={formatLink(post.link)} target="_blank" rel="noopener noreferrer">
                    {post.link}
                  </a>
                ) : "N/A"}
              </p>
              <p>
                <strong>Available Date:</strong>{" "}
                {formattedAvailableDate || "N/A"}
              </p>
              <p><strong>Truck Type:</strong> {post.truckType ?? "N/A"}</p>
              <p><strong>Pickup Address:</strong> {post.pickupAddress ?? "N/A"}</p>
              <p><strong>Drop-Off Address:</strong> {post.dropoffAddress ?? "N/A"}</p>
              <p><strong>Load Weight:</strong> {post.loadWeight ?? "N/A"} Pounds</p>
              <p><strong>Load Length:</strong> {post.loadLength ?? "N/A"} Feet</p>
              <p><strong>Estimated Rate Per Mile (with Tolls):</strong> ${eRPMwithTolls.eRPM ?? "N/A"}</p>
              <p><strong>Estimated Rate Per Mile (no Tolls):</strong> ${eRPMwithoutTolls.eRPM ?? "N/A"}</p>
              <p><strong>Payout:</strong> ${post.payout ?? "N/A"}</p>
            </div>
          )}
          {activeTab === "reviews" && <PostSectionReviews userId={post.userId} />}
        </div>

        {/* Action Grid */}
        <div className="lpm-action-grid">
          <button className="lpm-grid-btn" onClick={handleShare}><FaShareAlt /> Share</button>
          <button className={`lpm-grid-btn ${bookmarked ? 'active' : ''}`}><FaBookmark /> Bookmark</button>
          <button className="lpm-grid-btn"><FaFlag /> Report</button>
        </div>

        <button 
          className="lpm-add-cart-btn" 
          disabled={isSeller || isInCart}
          onClick={handleAddToCart}
        >
          {isInCart ? "ITEM IN CART" : isSeller ? "YOUR POST" : "ADD TO CART"}
        </button>

        <hr className="lpm-divider" />

        <div className="lpm-comments-section">
          <h3>Comments</h3>
          <MainCommentsSection postId={id} />
        </div>

        <div className="lpm-promoted-section">
          <h3>Promoted</h3>
          <PromotedPanel category="loads" />
        </div>
      </div>

      {/* Overlays */}
      {showOverlay && (
        <ViewPhotoOverlay photoUrl={overlayImage} onClose={() => setShowOverlay(false)} />
      )}
      {showCartOverlay && (
        <ItemInCartOverlay productName={post.title} onClose={() => setShowCartOverlay(false)} />
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

export default LoadPostMobile;