import React, { useState } from "react";
import { FaStar, FaShareAlt, FaBookmark, FaFlag, FaArrowLeft, FaArrowRight, FaExpand } from "react-icons/fa";
import "./PostSection.css";

function PostSection() {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
  ];

  const nextImage = () => setCurrentImage((currentImage + 1) % images.length);
  const prevImage = () => setCurrentImage((currentImage - 1 + images.length) % images.length);

  return (
    <div className="post-section">
      {/* Left Panel */}
      <div className="post-left">
        <div className="post-content">
          <div className="post-header">
            <div className="breadcrumbs">VRUMIES / MARKET / AUTO PARTS</div>
            <div className="date">DATE POSTED: August, 29, 2024</div>
          </div>
          <h2 className="post-title">HAMMAKA HITCH STAND COMBO</h2>

          <div className="seller-row">
            <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Seller" className="seller-avatar" />
            <div>
              <div className="seller-name">Gryan Dumimson</div>
              <div className="seller-reviews">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color="#f6c61d" />
                ))}
                <span className="review-count">54 Reviews</span>
              </div>
            </div>
            <button className="message-user">Message User</button>
          </div>

          <div className="tabs">
            <div className="tab active">DESCRIPTION</div>
            <div className="tab">POST DETAILS</div>
            <div className="tab">SELLER REVIEWS</div>
          </div>

          <p className="description">
            Customize your truck with this easy to use trailer hitch attachment which allow you to hang two hammock chairs from the rear of your vehicle.
          </p>
        </div>

        <div className="bottom-left-actions">
          <div className="price-row">
            <span className="price">$375.99</span>
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
          <FaExpand className="expand-icon" />
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
