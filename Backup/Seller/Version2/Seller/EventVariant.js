import React, { useState, useRef } from "react";
import "./EventVariant.css";
import { FaFilePdf, FaCheck } from "react-icons/fa";

export default function EventVariant() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => setUploadedFile(e.target.files[0]);
  const handleUpload = () => {
    if (uploadedFile) alert(`File "${uploadedFile.name}" uploaded!`);
    else alert("No file selected!");
  };
  const handleClear = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="seller-event-details-panel">
      <h2 className="seller-panel-title">ORDER DETAILS</h2>

      {/* Order Details */}
      <section className="seller-section">
        <h3>Order Details</h3>
        <div className="seller-order-info">
          <div><strong>Date</strong><p>06/06/2023</p></div>
          <div><strong>Type</strong><p>Event</p></div>
          <div><strong>Order ID</strong><p>254685</p></div>
        </div>

        {/* Ticket File */}
        <div className="seller-ticket-file">
          <strong>Ticket File:</strong>
          <div
            className="seller-drag-drop-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            {uploadedFile ? uploadedFile.name : "Drag & Drop PDF here or click to select file"}
          </div>

          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            className="seller-file-input"
            onChange={handleFileChange}
          />

          <div className="seller-upload-clear-buttons">
            <button onClick={handleUpload} className="seller-btn-upload">Upload</button>
            <button onClick={handleClear} className="seller-btn-clear">Clear</button>
          </div>

          {uploadedFile && (
            <div className="seller-ticket-download">
              <FaFilePdf className="seller-ticket-icon" />
              <div><p className="seller-ticket-name">{uploadedFile.name}</p></div>
            </div>
          )}
        </div>
      </section>

      {/* Ordered Items */}
      <section className="seller-section">
        <h3>Ordered Items</h3>
        <div className="seller-item-card">
          <img src="https://www.nrgpark.com/wp-content/uploads/event-super-car-show.webp" alt="Product" />
          <div>
            <div><strong>Title</strong><p>Cars & Cofee Meetup</p></div>
            <div><strong>Description</strong><p>tart your weekend engines and fuel your passion for automobiles at the Cars & Coffee Meetup! Join fellow car enthusiasts for a casual, fun-filled morning where exotic cars, classic rides, and everything in between come together. Enjoy a relaxed atmosphere with coffee, great conversation, and the chance to show off your ride or admire others. Whether you're a seasoned collector, a weekend hobbyist, or simply a car fan, this meetup is the perfect way to connect with like-minded enthusiasts.</p></div>
            <button className="seller-btn-view">View Post</button>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="seller-section">
        <h3>Payment Information</h3>
        <div className="seller-payment-info">
          <div>
            <strong>Price</strong><p>$25.00</p>
            <strong>Transaction Fee (15%)</strong><p>$3.75</p>
            <strong>Total</strong><p>$28.75</p>
          </div>
          <div>
            <strong>Payment Method</strong><p>Card</p>
            <strong>Last 4 digits of Card</strong><p>4565</p>
          </div>
        </div>
      </section>

      {/* Buyer Information */}
      <section className="seller-section">
        <h3>Buyer Information</h3>
        <div><strong>Buyer</strong><p>Gryan Dumimson</p></div>
        <button className="seller-btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="seller-section">
        <h3>Status</h3>
        <div className="seller-timeline-wrapper">
          <div className="seller-timeline-step">
            <div className="seller-circle active"><FaCheck /></div>
            <p className="seller-timeline-label seller-active-label">Order Started</p>
          </div>
          <div className="seller-arrow">→</div>
          <div className="seller-timeline-step">
            <div className="seller-circle"></div>
            <p className="seller-timeline-label">Marked Completed by Buyer</p>
          </div>
          <div className="seller-arrow">→</div>
          <div className="seller-timeline-step">
            <div className="seller-circle"></div>
            <p className="seller-timeline-label">Completed</p>
          </div>
        </div>

        <div className="seller-status-buttons">
          <button className="seller-btn-complete">Mark as Completed</button>
          <button className="seller-btn-dispute">Dispute</button>
        </div>
      </section>
    </div>
  );
}
