import React, { useState } from "react";
import { FaStar, FaShareAlt, FaBookmark, FaFlag, FaArrowLeft, FaArrowRight, FaExpand } from "react-icons/fa";
import "./PostSection.css";

function PostSection({ post }) {
  const [currentImage, setCurrentImage] = useState(0);

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

  const sellerName = post.sellerName || "Seller info not available";
  const sellerAvatar = post.sellerAvatar || `${process.env.PUBLIC_URL}/default-profile.png`;
  const sellerReviews = post.sellerReviews || 0;
  const price = post.price ? `$${post.price}` : "Price not available";

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
                  <FaStar key={i} color={i < sellerReviews ? "#f6c61d" : "#ccc"} />
                ))}
                <span className="review-count">{sellerReviews} Reviews</span>
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
            <span className="price">{price}</span>
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
