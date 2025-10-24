import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import "./MarketVariant.css";

export default function MarketVariant() {
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSave = () => {
    console.log("Saved Carrier:", carrier);
    console.log("Saved Tracking Number:", trackingNumber);
    alert("Tracking info saved!");
  };

  const handleClear = () => {
    setCarrier("");
    setTrackingNumber("");
  };

  return (
    <div className="sm-panel">
      <h2 className="sm-title">ORDER DETAILS</h2>

      {/* Order Details */}
      <section className="sm-section">
        <h3>Order Details</h3>
        <div className="sm-info">
          <div><strong>Date</strong><p>06/06/2023</p></div>
          <div><strong>Type</strong><p>Market</p></div>
          <div><strong>Order ID</strong><p>254685</p></div>
        </div>
        <div>
          <strong>Shipping Address</strong>
          <p>13251 Marylane Drive, Houston TX 77024</p>
        </div>

        {/* Carrier + Tracking Fields */}
        <div className="sm-tracking-fields">
          <div>
            <strong>Carrier</strong>
            <input
              type="text"
              placeholder="Enter Carrier (e.g., FEDEX)"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
            />
          </div>
          <div>
            <strong>Tracking Number</strong>
            <input
              type="text"
              placeholder="Enter Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons for both inputs */}
        <div className="sm-tracking-btn-wrapper">
          <button className="sm-btn-save" onClick={handleSave}>Save</button>
          <button className="sm-btn-clear" onClick={handleClear}>Clear</button>
        </div>
      </section>

      {/* Ordered Items */}
      <section className="sm-section">
        <h3>Ordered Items</h3>
        <div className="sm-item">
          <img
            src="https://m.media-amazon.com/images/I/61TDUwjqKCL._UF894,1000_QL80_.jpg"
            alt="Product"
          />
          
          <div>
            <div><strong>Title</strong><p>Hammaka Hitch Stand Combo</p></div>
            <div><strong>Description</strong><p>Upgrade your outdoor relaxation setup with the Hammaka Hitch Stand Combo – the ultimate solution for effortless comfort anywhere! This versatile combo includes a durable hitch-mounted stand and a premium hammock, providing a secure and portable lounging experience. Crafted with high-quality materials, the stand supports your hammock safely while being easy to assemble and transport. Perfect for camping, tailgating, backyard lounging, or road trips, the Hammaka Hitch Stand Combo delivers unmatched convenience and relaxation. Lightweight yet sturdy, it’s designed to fit most vehicles with a standard hitch receiver, giving you the freedom to unwind wherever you go.</p></div>
            <button className="sm-btn-view">View Post</button>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="sm-section">
        <h3>Payment Information</h3>
        <div className="sm-payment">
          <div>
            <strong>Price</strong><p>$375.99</p>
            <strong>Transaction Fee (15%)</strong><p>$56.40</p>
            <strong>Total</strong><p>$432.39</p>
          </div>
          <div>
            <strong>Payment Method</strong><p>Card</p>
            <strong>Last 4 digits of Card</strong><p>4565</p>
          </div>
        </div>
      </section>

      {/* Buyer Information */}
      <section className="sm-section">
        <h3>Buyer Information</h3>
        <div><strong>Buyer</strong><p>Gryan Dumimson</p></div>
        <button className="sm-btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="sm-section">
        <h3>Status</h3>
        <div className="sm-timeline-wrapper">
          <div className="sm-timeline-step">
            <div className="sm-circle active"><FaCheck /></div>
            <p className="sm-timeline-label active-label">Order Started</p>
          </div>
          <div className="sm-arrow">→</div>
          <div className="sm-timeline-step">
            <div className="sm-circle"></div>
            <p className="sm-timeline-label">Marked Completed by Buyer</p>
          </div>
          <div className="sm-arrow">→</div>
          <div className="sm-timeline-step">
            <div className="sm-circle"></div>
            <p className="sm-timeline-label">Completed</p>
          </div>
        </div>

        <div className="sm-status-buttons">
          <button className="sm-btn-complete">Mark as Completed</button>
          <button className="sm-btn-dispute">Dispute</button>
        </div>
      </section>
    </div>
  );
}
