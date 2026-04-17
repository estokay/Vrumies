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

import "./MarketPostMobile.css";

const MarketPostMobile = () => {
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
        if (postData.type !== 'market') {
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

  if (loading) return <div className="mpm-loader">Loading...</div>;
  if (!post) return null;

  const images = post.images?.length > 0 ? post.images : ["/default-thumbnail.png"];
  const isSeller = currentUser?.uid === post.userId;

  return (
    <div className="mpm-container">
      {notification && <div className="mpm-toast">{notification}</div>}
      
      <PageHeader 
        title="Market Post" 
        backgroundUrl="https://res.cloudinary.com/dmjvngk3o/image/upload/v1770817699/71d90db6-3ded-4f1d-831d-61c8a2fc96be_sqmlwb.png" 
      />

      {/* Header Info */}
      <div className="mpm-header-actions">
        <span className="mpm-breadcrumb">VRUMIES / MARKET</span>
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
      <div className="mpm-image-section">
        <div className="mpm-main-image-wrapper">
          <img 
            src={images[currentImage]} 
            alt="Product" 
            className="mpm-main-image"
            onClick={() => {
              setOverlayIndex(currentImage);
              setShowOverlay(true);
            }}
          />
          <div className="mpm-image-counter">{currentImage + 1} / {images.length}</div>
        </div>
        <div className="mpm-thumbnails">
          {images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              className={`mpm-thumb ${idx === currentImage ? "active" : ""}`} 
              onClick={() => setCurrentImage(idx)}
              alt="thumb"
            />
          ))}
        </div>
      </div>

      {/* Content Body */}
      <div className="mpm-body">
        <h1 className="mpm-title">{post.title?.toUpperCase()}</h1>
        <div className="mpm-price-tag">
          {post.price !== undefined
            ? `$${post.price.toFixed(2)}`
            : "Price N/A"}
        </div>
        
        <div className="mpm-seller-card">
          <Link to={`/viewprofile/${post.userId}`}>
            <img src={seller?.profilepic || "/default-profile.png"} className="mpm-seller-avatar" alt="seller" />
          </Link>
          <div className="mpm-seller-info">
            <Link to={`/viewprofile/${post.userId}`} className="mpm-seller-name">{seller?.username}</Link>
            <SellerRating userId={post.userId} />
          </div>
          <button className={`mpm-follow-btn ${followed ? 'active' : ''}`} onClick={() => setFollowed(!followed)}>
            {followed ? "Following" : "Follow"}
          </button>
        </div>

        {/* Tabs */}
        <div className="mpm-tabs">
          {["description", "details", "reviews"].map(tab => (
            <div 
              key={tab}
              className={`mpm-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="mpm-tab-content">
          {activeTab === "description" && <p>{post.description}</p>}
          {activeTab === "details" && (
            <div className="mpm-details-list">
              <p><strong>Condition:</strong> {post.condition || "N/A"}</p>
              <p><strong>Shipping:</strong> {post.shippingTime || "N/A"}</p>
              <p><strong>Tokens:</strong> {post.tokens || "0"}</p>
            </div>
          )}
          {activeTab === "reviews" && <PostSectionReviews userId={post.userId} />}
        </div>

        {/* Action Grid */}
        <div className="mpm-action-grid">
          <button className="mpm-grid-btn" onClick={handleShare}><FaShareAlt /> Share</button>
          <button className={`mpm-grid-btn ${bookmarked ? 'active' : ''}`}><FaBookmark /> Bookmark</button>
          <button className="mpm-grid-btn"><FaFlag /> Report</button>
        </div>

        <button 
          className="mpm-add-cart-btn" 
          disabled={isSeller || isInCart}
          onClick={handleAddToCart}
        >
          {isInCart ? "ITEM IN CART" : isSeller ? "YOUR POST" : "ADD TO CART"}
        </button>

        <hr className="mpm-divider" />

        <div className="mpm-comments-section">
          <h3>Comments</h3>
          <MainCommentsSection postId={id} />
        </div>

        <div className="mpm-promoted-section">
          <h3>Promoted</h3>
          <PromotedPanel category="market" />
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
          }}
        />
      )}
      {showCartOverlay && (
        <ItemInCartOverlay productName={post.title} onClose={() => setShowCartOverlay(false)} />
      )}
      {/* ... Other overlays follow same pattern ... */}
      {showAffiliateLinkOverlay && (
        <CreateAffiliateLinkOverlay
          postId={id}
          isOpen={showAffiliateLinkOverlay}
          onClose={() => setShowAffiliateLinkOverlay(false)}
        />
      )}
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

export default MarketPostMobile;