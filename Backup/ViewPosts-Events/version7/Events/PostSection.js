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
import { doc, getDoc } from "firebase/firestore";
import "./PostSection.css";

function PostSection({ postId }) {
  const [post, setPost] = useState(null);
  const [seller, setSeller] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, "Posts", postId);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) {
          console.warn("Post not found");
          setLoading(false);
          return;
        }
        const postData = postSnap.data();
        setPost(postData);

        const userRef = doc(db, "Users", postData.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setSeller(userSnap.data());
        } else {
          setSeller({
            username: "Unknown",
            profilepic: `${process.env.PUBLIC_URL}/default-profile.png`,
          });
        }
      } catch (err) {
        console.error("Error fetching post or user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  if (loading)
    return <p style={{ color: "white", textAlign: "center" }}>Loading post...</p>;
  if (!post)
    return <p style={{ color: "white", textAlign: "center" }}>Post not found.</p>;

  const images =
    post.images && post.images.length > 0
      ? post.images
      : [`${process.env.PUBLIC_URL}/default-thumbnail.png`];

  const nextImage = () =>
    setCurrentImage((currentImage + 1) % images.length);
  const prevImage = () =>
    setCurrentImage((currentImage - 1 + images.length) % images.length);

  const postTitle = post.title || "Title not available";
  const postDescription = post.description || "Description not available";
  const postDate = post.createdAt
    ? new Date(post.createdAt.seconds * 1000).toLocaleDateString()
    : "Date not available";

  const sellerName = seller?.username || "Seller info not available";
  const sellerAvatar =
    seller?.profilepic || `${process.env.PUBLIC_URL}/default-profile.png`;

  const formatLink = (url) => {
    if (!url) return null;
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  };

  return (
    <div className="post-section">
      {/* Left Panel */}
      <div className="post-left">
        <div className="post-content">
          <div className="post-header">
            <div className="breadcrumbs">VRUMIES / EVENTS</div>
            <div className="date">DATE POSTED: {postDate}</div>
          </div>

          <h2 className="post-title">{postTitle.toUpperCase()}</h2>

          <div className="seller-row">
            <img src={sellerAvatar} alt="Seller" className="seller-avatar" />
            <div>
              <div className="seller-name">{sellerName}</div>
              <div className="seller-reviews">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    color={i < (post.sellerReviews || 0) ? "#f6c61d" : "#ccc"}
                  />
                ))}
                <span className="review-count">
                  {post.sellerReviews || 0} Reviews
                </span>
              </div>
            </div>
            <button className="message-user">Message User</button>
          </div>

          {/* Tabs */}
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

          {/* Tab Content */}
          {activeTab === "description" && (
            <p className="description">{postDescription}</p>
          )}

          {activeTab === "details" && (
            <div className="post-details">
              <p>
                <strong>Tokens:</strong> {post.tokens ?? "N/A"}
              </p>
              <p>
                <strong>Location:</strong> {post.location ?? "N/A"}
              </p>
              <p>
                <strong>Link:</strong>{" "}
                {post.link ? (
                  <a
                    href={formatLink(post.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {post.link}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="seller-reviews-section">
              <p>Seller reviews will go here...</p>
            </div>
          )}
        </div>

        {/* Bottom-left / bottom-right buttons */}
        <div className="bottom-left-actions">
          <div className="actions">
            <button className="action-btn">
              <FaShareAlt color="#00ff00" />
              SHARE
            </button>
            <button className="action-btn">
              <FaBookmark color="#00ff00" />
              BOOKMARK
            </button>
            <button className="action-btn">
              <FaFlag color="#00ff00" />
              REPORT
            </button>
          </div>

          <div className="price-row">
            <span className="price">
              {post.price ? `${post.price}` : "Price not available"}
            </span>
            <button className="addtoCart">ADD TO CART</button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="post-right">
        <div className="image-container">
          <img
            src={images[currentImage]}
            alt="Product"
            className="main-image"
          />
          <a
            href={images[currentImage]}
            target="_blank"
            rel="noopener noreferrer"
            title="Open image in new tab"
          >
            <FaExpand className="expand-icon" />
          </a>
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
    </div>
  );
}

export default PostSection;
