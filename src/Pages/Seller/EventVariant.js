import React, { useState, useRef } from "react";
import "./EventVariant.css";
import { FaFilePdf, FaCheck } from "react-icons/fa";

export default function EventVariant() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection via input
  const handleFileChange = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  // Handle file upload (placeholder)
  const handleUpload = () => {
    if (uploadedFile) {
      console.log("Uploading file:", uploadedFile.name);
      alert(`File "${uploadedFile.name}" uploaded!`);
      // TODO: send uploadedFile to backend
    } else {
      alert("No file selected!");
    }
  };

  // Clear the uploaded file
  const handleClear = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  // Drag & drop handlers
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
    <div className="event-details-panel">
      <h2 className="panel-title">ORDER DETAILS</h2>

      {/* Order Details */}
      <section className="section">
        <h3>Order Details</h3>
        <div className="order-info">
          <div><strong>Order Number</strong><p>254685</p></div>
          <div><strong>Date</strong><p>06/06/2023</p></div>
          <div><strong>Type</strong><p>Event</p></div>
        </div>

        <div className="ticket-file">
          <strong>Ticket File:</strong>

          {/* Drag and Drop Upload Area */}
          <div 
            className="drag-drop-area" 
            onDragOver={handleDragOver} 
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            {uploadedFile ? (
              <p>{uploadedFile.name}</p>
            ) : (
              <p>Drag & Drop PDF here or click to select file</p>
            )}
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            className="file-input"
            onChange={handleFileChange}
          />

          <div className="upload-clear-buttons">
            <button onClick={handleUpload} className="btn-upload">Upload</button>
            <button onClick={handleClear} className="btn-clear">Clear</button>
          </div>

          {/* Display uploaded file */}
          {uploadedFile && (
            <div className="ticket-download">
              <FaFilePdf className="ticket-icon" />
              <div>
                <p className="ticket-name">{uploadedFile.name}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Ordered Items */}
      <section className="section">
        <h3>Ordered Items</h3>
        <div className="item-card">
          <img src="https://www.nrgpark.com/wp-content/uploads/event-super-car-show.webp" alt="Product" />
          <div>
            <div><strong>Title</strong><p>Cars & Cofee Meetup</p></div>
            <div><strong>Price</strong><p>$25.00</p></div>
            <button className="btn-view">View Post</button>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="section">
        <h3>Payment Information</h3>
        <div className="payment-info">
          <div>
            <strong>Subtotal</strong><p>$25.00</p>
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
      <section className="section">
        <h3>Buyer Information</h3>
        <div><strong>Buyer</strong><p>Gryan Dumimson</p></div>
        <div><strong>Location</strong><p>Dallas, TX</p></div>
        <button className="btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="section">
        <h3>Status</h3>
        <div className="timeline-wrapper">
          <div className="timeline-step">
            <div className="circle active"><FaCheck /></div>
            <p className="timeline-label active-label">Order Started</p>
          </div>
          <div className="arrow">→</div>
          <div className="timeline-step">
            <div className="circle"></div>
            <p className="timeline-label">Marked Completed by Buyer</p>
          </div>
          <div className="arrow">→</div>
          <div className="timeline-step">
            <div className="circle"></div>
            <p className="timeline-label">Completed</p>
          </div>
        </div>

        <div className="status-buttons">
          <button className="btn-complete">Mark as Completed</button>
          <button className="btn-dispute">Dispute</button>
        </div>
      </section>
    </div>
  );
}
