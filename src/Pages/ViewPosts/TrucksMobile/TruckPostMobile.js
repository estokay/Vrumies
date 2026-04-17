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

import "./TruckPostMobile.css";

const TruckPostMobile = () => {
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
        if (postData.type !== 'trucks') {
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

  const formattedAvailableDate = useTimestampObjectToDate(post?.availableDate);

  if (loading) return <div className="tpm-loader">Loading...</div>;
  if (!post) return null;

  const images = post.images?.length > 0 ? post.images : ["/default-thumbnail.png"];
  const isSeller = currentUser?.uid === post.userId;

  const formatLink = (url) =>
    url ? (url.startsWith("http") ? url : `https://${url}`) : null;

  return (
    <div className="tpm-container">
      {notification && <div className="tpm-toast">{notification}</div>}
      
      <PageHeader 
        title="Market Post" 
        backgroundUrl="https://res.cloudinary.com/dmjvngk3o/image/upload/v1770817699/71d90db6-3ded-4f1d-831d-61c8a2fc96be_sqmlwb.png" 
      />

      {/* Header Info */}
      <div className="tpm-header-actions">
        <span className="tpm-breadcrumb">VRUMIES / TRUCKS</span>
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
      <div className="tpm-image-section">
        <div className="tpm-main-image-wrapper">
          <img 
            src={images[currentImage]} 
            alt="Product" 
            className="tpm-main-image"
            onClick={() => {
              setOverlayIndex(currentImage);
              setShowOverlay(true);
            }}
          />
          <div className="tpm-image-counter">{currentImage + 1} / {images.length}</div>
        </div>
        <div className="tpm-thumbnails">
          {images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              className={`tpm-thumb ${idx === currentImage ? "active" : ""}`} 
              onClick={() => setCurrentImage(idx)}
              alt="thumb"
            />
          ))}
        </div>
      </div>

      {/* Content Body */}
      <div className="tpm-body">
        <h1 className="tpm-title">{post.title?.toUpperCase()}</h1>
        <div className="tpm-price-tag">
          {post.price !== undefined
            ? `RPM: $${post.minPerMile.toFixed(2)}`
            : "Price N/A"}
        </div>
        
        <div className="tpm-seller-card">
          <Link to={`/viewprofilemobile/${post.userId}`}>
            <img src={seller?.profilepic || "/default-profile.png"} className="tpm-seller-avatar" alt="seller" />
          </Link>
          <div className="tpm-seller-info">
            <Link to={`/viewprofilemobile/${post.userId}`} className="tpm-seller-name">{seller?.username}</Link>
            <SellerRating userId={post.userId} />
          </div>
          <button className={`tpm-follow-btn ${followed ? 'active' : ''}`} onClick={() => setFollowed(!followed)}>
            {followed ? "Following" : "Follow"}
          </button>
        </div>

        {/* Tabs */}
        <div className="tpm-tabs">
          {["description", "details", "reviews"].map(tab => (
            <div 
              key={tab}
              className={`tpm-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="tpm-tab-content">
          {activeTab === "description" && <p>{post.description}</p>}
          {activeTab === "details" && (
            <div className="tpm-details-list">
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
              <p>
                <strong>Origin Cities:</strong>{" "}
                {post.originCities?.length
                  ? post.originCities.join(" • ")
                  : "N/A"}
              </p>

              <p>
                <strong>Destination Cities:</strong>{" "}
                {post.destinationCities?.length
                  ? post.destinationCities.join(" • ")
                  : "N/A"}
              </p>
              <p><strong>Load Weight Max:</strong> {post.loadWeightMax ?? "N/A"}</p>
              <p><strong>Load Length Max:</strong> {post.loadLengthMax ?? "N/A"}</p>
              <p><strong>Min Per Mile Rate:</strong> ${post.minPerMile ?? "N/A"}</p>
            </div>
          )}
          {activeTab === "reviews" && <PostSectionReviews userId={post.userId} />}
        </div>

        {/* Action Grid */}
        <div className="tpm-action-grid">
          <button className="tpm-grid-btn" onClick={handleShare}><FaShareAlt /> Share</button>
          <button className={`tpm-grid-btn ${bookmarked ? 'active' : ''}`}><FaBookmark /> Bookmark</button>
          <button className="tpm-grid-btn"><FaFlag /> Report</button>
        </div>

        <button 
          className="tpm-add-cart-btn" 
          disabled={isSeller || isInCart}
          onClick={handleAddToCart}
        >
          {isInCart ? "ITEM IN CART" : isSeller ? "YOUR POST" : "ADD TO CART"}
        </button>

        <hr className="tpm-divider" />

        <div className="tpm-comments-section">
          <h3>Comments</h3>
          <MainCommentsSection postId={id} />
        </div>

        <div className="tpm-promoted-section">
          <h3>Promoted</h3>
          <PromotedPanel category="trucks" />
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

export default TruckPostMobile;