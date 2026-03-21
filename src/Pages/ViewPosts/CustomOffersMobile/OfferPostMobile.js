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

import "./OfferPostMobile.css";

const OfferPostMobile = () => {
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
        if (postData.type !== 'offer') {
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

  if (loading) return <div className="opm-loader">Loading...</div>;
  if (!post) return null;

  const images = post.images?.length > 0 ? post.images : ["/default-thumbnail.png"];
  const isSeller = currentUser?.uid === post.userId;

  return (
    <div className="opm-container">
      {notification && <div className="opm-toast">{notification}</div>}
      
      <PageHeader 
        title="Market Post" 
        backgroundUrl="https://res.cloudinary.com/dmjvngk3o/image/upload/v1770817699/71d90db6-3ded-4f1d-831d-61c8a2fc96be_sqmlwb.png" 
      />

      {/* Header Info */}
      <div className="opm-header-actions">
        <span className="opm-breadcrumb">VRUMIES / CUSTOM OFFERS</span>
        <PostDropMenu 
          canDelete={isSeller} 
          onDelete={() => setShowDeletePostOverlay(true)} 
          canBlock={!isSeller} 
          onBlock={() => setShowBlockUserOverlay(true)} 
          canAffiliate={!isSeller} 
          onAffiliate={() => setShowAffiliateLinkOverlay(true)}
          canReport={true}
          reported={reported} 
        />
      </div>

      {/* Image Carousel */}
      <div className="opm-image-section">
        <div className="opm-main-image-wrapper">
          <img 
            src={images[currentImage]} 
            alt="Product" 
            className="opm-main-image"
            onClick={() => { setOverlayImage(images[currentImage]); setShowOverlay(true); }}
          />
          <div className="opm-image-counter">{currentImage + 1} / {images.length}</div>
        </div>
        <div className="opm-thumbnails">
          {images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              className={`opm-thumb ${idx === currentImage ? "active" : ""}`} 
              onClick={() => setCurrentImage(idx)}
              alt="thumb"
            />
          ))}
        </div>
      </div>

      {/* Content Body */}
      <div className="opm-body">
        <h1 className="opm-title">{post.title?.toUpperCase()}</h1>
        <div className="opm-price-tag">{post.price ?? "Price N/A"}</div>
        
        <div className="opm-seller-card">
          <Link to={`/viewprofile/${post.userId}`}>
            <img src={seller?.profilepic || "/default-profile.png"} className="opm-seller-avatar" alt="seller" />
          </Link>
          <div className="opm-seller-info">
            <Link to={`/viewprofile/${post.userId}`} className="opm-seller-name">{seller?.username}</Link>
            <SellerRating userId={post.userId} />
          </div>
          <button className={`opm-follow-btn ${followed ? 'active' : ''}`} onClick={() => setFollowed(!followed)}>
            {followed ? "Following" : "Follow"}
          </button>
        </div>

        {/* Tabs */}
        <div className="opm-tabs">
          {["description", "details", "reviews"].map(tab => (
            <div 
              key={tab}
              className={`opm-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="opm-tab-content">
          {activeTab === "description" && <p>{post.description}</p>}
          {activeTab === "details" && (
            <div className="opm-details-list">
              <p><strong>Condition:</strong> {post.condition || "N/A"}</p>
              <p><strong>Shipping:</strong> {post.shippingTime || "N/A"}</p>
              <p><strong>Tokens:</strong> {post.tokens || "0"}</p>
            </div>
          )}
          {activeTab === "reviews" && <PostSectionReviews userId={post.userId} />}
        </div>

        {/* Action Grid */}
        <div className="opm-action-grid">
          <button className="opm-grid-btn" onClick={handleShare}><FaShareAlt /> Share</button>
          <button className={`opm-grid-btn ${bookmarked ? 'active' : ''}`}><FaBookmark /> Bookmark</button>
          <button className="opm-grid-btn"><FaFlag /> Report</button>
        </div>

        <button 
          className="opm-add-cart-btn" 
          disabled={isSeller || isInCart}
          onClick={handleAddToCart}
        >
          {isInCart ? "ITEM IN CART" : isSeller ? "YOUR POST" : "ADD TO CART"}
        </button>

        <hr className="opm-divider" />

        <div className="opm-comments-section">
          <h3>Comments</h3>
          <MainCommentsSection postId={id} />
        </div>

        <div className="opm-promoted-section">
          <h3>Promoted</h3>
          <PromotedPanel category="offer" />
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
    </div>
  );
};

export default OfferPostMobile;