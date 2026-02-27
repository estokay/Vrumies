import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaShareAlt,
  FaBookmark,
  FaFlag,
  FaArrowLeft,
  FaArrowRight,
  FaExpand,
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
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import "./PostSection.css";
import SellerRating from "../../../Components/Reviews/SellerRating";
import ViewPhotoOverlay from "../../../Components/Overlays/ViewPhotoOverlay";
import PostSectionReviews from '../../../Components/PostSectionReviews';
import PostDropMenu from "../../../Components/PostDropMenu";
import DeletePostOverlay from "../../../Components/Overlays/DeletePostOverlay";

function PostSection({ postId }) {
  const [post, setPost] = useState(null);
  const [seller, setSeller] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [reported, setReported] = useState(false);
  const [notification, setNotification] = useState("");
  const [followed, setFollowed] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayImage, setOverlayImage] = useState(null);
  const [showPostDropMenu, setShowDropMenu] = useState(false);

  // Fetch post and seller info
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, "Posts", postId);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) {
          setLoading(false);
          return;
        }
        const postData = postSnap.data();
        setPost(postData);

        const userRef = doc(db, "Users", postData.userId);
        const userSnap = await getDoc(userRef);
        setSeller(
          userSnap.exists()
            ? userSnap.data()
            : { username: "Unknown", profilepic: `${process.env.PUBLIC_URL}/default-profile.png` }
        );

        // Bookmark check
        if (currentUser) {
          const currentUserRef = doc(db, "Users", currentUser.uid);
          const userSnap = await getDoc(currentUserRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setBookmarked(userData.bookmarks?.includes(postId) || false);
          }
        }

        // Report check
        if (currentUser) {
          const userReported = postData.report?.includes(currentUser.uid) || false;
          setReported(userReported);
        }

      } catch (err) {
        console.error("Error fetching post/user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId, currentUser]);

  const showNotification = (msg, duration = 2000) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), duration);
  };

  const handleMessageUser = async (sellerId) => {
    if (!currentUser || !sellerId) return;

    try {
      const userRef = doc(db, "Users", sellerId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        showNotification("User not found", 4000); // 4-second popup
        return;
      }

      const chatsRef = collection(db, "chats");
      const q = query(chatsRef, where("participants", "array-contains", currentUser.uid));
      const snapshot = await getDocs(q);

      let chatId = null;
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.participants.includes(sellerId)) chatId = docSnap.id;
      });

      if (!chatId) {
        const newChatRef = await addDoc(chatsRef, {
          userA: currentUser.uid,
          userB: sellerId,
          participants: [currentUser.uid, sellerId],
          lastMessage: "",
          lastTimestamp: serverTimestamp(),
        });
        chatId = newChatRef.id;

        await addDoc(collection(db, "chats", chatId, "messages"), {
          senderId: currentUser.uid,
          text: "👋 Hello! Thanks for posting.",
          timestamp: serverTimestamp(),
          photos: [],
          seenBy: [currentUser.uid],
        });

        await setDoc(
          doc(db, "chats", chatId),
          { lastMessage: "👋 Hello! Thanks for posting.", lastTimestamp: serverTimestamp() },
          { merge: true }
        );
      }

      navigate(`/inbox?chat=${chatId}`);
    } catch (err) {
      console.error(err);
      showNotification("Error messaging user", 4000);
    }
  };

  const handleFollow = () => {
    setFollowed(!followed);
    showNotification(followed ? "Unfollowed" : "Followed", 2000);
  };

  const handleBlockUser = () => {
    console.log("TODO: Block this user");
  };

  const handleAddToCart = async () => {
    if (!currentUser) {
      alert("Login required");
      return;
    }
    try {
      const cartRef = collection(db, "Users", currentUser.uid, "cart");
      const itemRef = doc(cartRef, postId);
      const existing = await getDoc(itemRef);
      if (existing.exists()) {
        alert("Already in cart");
        return;
      }

      await setDoc(itemRef, {
        postId,
        title: post.title || "Untitled",
        price: post.price || 0,
        sellerId: post.userId,
        sellerName: seller?.username || "Unknown Seller",
        sellerAvatar: seller?.profilepic || `${process.env.PUBLIC_URL}/default-profile.png`,
        image: post.images?.[0] || `${process.env.PUBLIC_URL}/default-thumbnail.png`,
        reviews: post.sellerReviews || 0,
        addedAt: new Date(),
      });

      alert("Item added to cart!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          showNotification("URL copied!", 2000);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => console.error(err));
    } else alert("Clipboard API not supported.");
  };

  const handleBookmark = async () => {
    if (!currentUser) return;
    const userRef = doc(db, "Users", currentUser.uid);
    try {
      if (bookmarked) {
        await updateDoc(userRef, { bookmarks: arrayRemove(postId) });
        setBookmarked(false);
        showNotification("Removed from bookmarks");
      } else {
        await updateDoc(userRef, { bookmarks: arrayUnion(postId) });
        setBookmarked(true);
        showNotification("Saved to bookmarks");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async () => {
    if (!currentUser) return;
    const postRef = doc(db, "Posts", postId);
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

  if (loading) return <p style={{ color: "white", textAlign: "center" }}>Loading post...</p>;
  if (!post) return <p style={{ color: "white", textAlign: "center" }}>Post not found.</p>;

  const images =
    post.images && post.images.length > 0
      ? post.images
      : [`${process.env.PUBLIC_URL}/default-thumbnail.png`];
  const nextImage = () => setCurrentImage((currentImage + 1) % images.length);
  const prevImage = () => setCurrentImage((currentImage - 1 + images.length) % images.length);

  const postTitle = post.title || "Title not available";
  const postDescription = post.description || "Description not available";
  const postDate = post.createdAt
    ? new Date(post.createdAt.seconds * 1000).toLocaleDateString()
    : "Date not available";

  const sellerName = seller?.username || "Seller info not available";
  const sellerAvatar =
    seller?.profilepic || `${process.env.PUBLIC_URL}/default-profile.png`;

  const formatLink = (url) =>
    url ? (url.startsWith("http") ? url : `https://${url}`) : null;

  const isSeller = currentUser?.uid === post.userId;
  const canBlock = currentUser?.uid !== post.userId;

  return (
    <div className="post-section">
      {notification && <div className="copy-notification">{notification}</div>}

      <div className="post-left">
        <div className="post-content">
          <div className="post-header">
            <div className="breadcrumbs">VRUMIES / VEHICLES</div>
            <div className="date">DATE POSTED: {postDate}</div>
            <PostDropMenu onDelete={() => setShowDropMenu(true)} canDelete={isSeller} canBlock={canBlock} onBlock={handleBlockUser} />
          </div>
          <h2 className="post-title">{postTitle.toUpperCase()}</h2>

          <div className="seller-row">
            <img src={sellerAvatar} alt="Seller" className="seller-avatar" />
            <div>
              <div className="seller-name">{sellerName}</div>
              <SellerRating userId={post.userId} />
            </div>

            {/* Follow + Message buttons */}
            <div className="post-action-buttons">
              <button
                className={`post-action-btn follow-btn ${followed ? "follow-active" : ""}`}
                onClick={handleFollow}
              >
                {followed ? "Following" : "Follow"}
              </button>
              <button
                className="post-action-btn message-btn"
                onClick={() => handleMessageUser(post.userId)}
              >
                Message User
              </button>
            </div>
          </div>

          <div className="tabs">
            <div
              className={`tab ${activeTab === "description" ? "active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              DESCRIPTION
            </div>
            <div
              className={`tab ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              POST DETAILS
            </div>
            <div
              className={`tab ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              SELLER REVIEWS
            </div>
          </div>

          {activeTab === "description" && <p className="description">{postDescription}</p>}
          {activeTab === "details" && (
            <div className="post-details">
              <p><strong>Tokens:</strong> {post.tokens ?? "N/A"}</p>
              <p><strong>Post Location:</strong> {post.location ?? "N/A"}</p>
              <p><strong>Link:</strong>{" "}
                {post.link ? (
                  <a href={formatLink(post.link)} target="_blank" rel="noopener noreferrer">
                    {post.link}
                  </a>
                ) : "N/A"}
              </p>
            </div>
          )}
          {activeTab === "reviews" && (
            <PostSectionReviews userId={post.userId} />
          )}
        </div>

        <div className="actions">
          <button
            className={`action-btn share ${copied ? "active" : ""}`}
            onClick={handleShare}
          >
            <FaShareAlt className="action-icon" />
            SHARE
          </button>
          <button
            className={`action-btn bookmark ${bookmarked ? "active" : ""}`}
            onClick={handleBookmark}
          >
            <FaBookmark className="action-icon" />
            BOOKMARK
          </button>
          <button
            className={`action-btn report ${reported ? "active" : ""}`}
            onClick={handleReport}
          >
            <FaFlag className="action-icon" />
            REPORT
          </button>
        </div>

        <div className="price-row">
          <span className="price">{post.price ?? "Price: N/A"}</span>
          
        </div>
      </div>

      <div className="post-right">
        <div className="image-container">
          <img
            src={images[currentImage]}
            alt="Product"
            className="main-image"
            onClick={() => {
              setOverlayImage(images[currentImage]);
              setShowOverlay(true);
            }}
            style={{ cursor: "zoom-in" }}
          />

          <FaExpand
            className="expand-icon"
            onClick={() => {
              setOverlayImage(images[currentImage]);
              setShowOverlay(true);
            }}
          />
        </div>
        <div className="carousel">
          <FaArrowLeft className="arrow" onClick={prevImage} />
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Thumb ${idx}`}
              className={`thumb ${idx === currentImage ? "active" : ""}`}
              onClick={() => setCurrentImage(idx)}
            />
          ))}
          <FaArrowRight className="arrow" onClick={nextImage} />
        </div>
      </div>
      {showOverlay && (
        <ViewPhotoOverlay
          photoUrl={overlayImage}
          caption={post.title}
          createdAt={post.createdAt}
          onClose={() => {
            setShowOverlay(false);
            setOverlayImage(null);
          }}
        />
      )}
      {showPostDropMenu && (
        <DeletePostOverlay
          postId={postId}
          isOpen={showPostDropMenu}
          onClose={() => setShowDropMenu(false)}
          onConfirm={() => console.log("TODO: delete from Firestore")}
        />
      )}
    </div>
  );
}

export default PostSection;
