import React, { useState, useEffect } from "react";
import { FaStar, FaShareAlt, FaBookmark, FaFlag, FaArrowLeft, FaArrowRight, FaExpand } from "react-icons/fa";
import { db } from "../../../Components/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./PostSection.css";

function PostSection({ postId }) {
  const [post, setPost] = useState(null);
  const [seller, setSeller] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch post
        const postRef = doc(db, "Posts", postId);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) {
          console.warn("Post not found");
          setLoading(false);
          return;
        }
        const postData = postSnap.data();
        setPost(postData);

        // Fetch user
        const userRef = doc(db, "Users", postData.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setSeller(userSnap.data());
        } else {
          setSeller({ username: "Unknown", profilepic: `${process.env.PUBLIC_URL}/default-profile.png` });
        }
      } catch (err) {
        console.error("Error fetching post or user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  if (loading) return <p style={{ color: "white", textAlign: "center" }}>Loading post...</p>;
  if (!post) return <p style={{ color: "white", textAlign: "center" }}>Post not found.</p>;

  const images = post.images && post.images.length > 0
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
  const sellerAvatar = seller?.profilepic || `${process.env.PUBLIC_URL}/default-profile.png`;

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
                  <FaStar key={i} color={i < (post.sellerReviews || 0) ? "#f6c61d" : "#ccc"} />
                ))}
                <span className="review-count">{post.sellerReviews || 0} Reviews</span>
              </div>
            </div>
            <button className="message-user">Message User</button>
          </div>

          <div className="tabs">
            <div className="tab active">DESCRIPTION</div>
            <div className="tab">POST DETAILS</div>
            <div className="tab">SELLER REVIEWS</div>
          </div>

          <p className="description">{postDescription}</p>
        </div>

        <div className="bottom-left-actions">
          <div className="price-row">
            <span className="price">{post.price ? `$${post.price}` : "Price not available"}</span>
            <button className="buy-now">Buy Now</button>
          </div>

          <div className="actions">
            <div className="action"><FaShareAlt /> Share</div>
            <div className="action"><FaBookmark /> Bookmark</div>
            <div className="action"><FaFlag /> Report</div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="post-right">
        <div className="image-container">
          <img src={images[currentImage]} alt="Product" className="main-image" />
          <a href={images[currentImage]} target="_blank" rel="noopener noreferrer" title="Open image in new tab">
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
