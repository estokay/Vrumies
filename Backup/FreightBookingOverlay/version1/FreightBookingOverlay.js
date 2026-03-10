import React, { useState, useMemo } from "react";
import "./FreightBookingOverlay.css";

const FreightBookingOverlay = ({ onClose }) => {
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [loadWeight, setLoadWeight] = useState("");
  const [loadLength, setLoadLength] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Dummy price calculation
  const price = useMemo(() => {
    const weight = parseFloat(loadWeight) || 0;
    const length = parseFloat(loadLength) || 0;

    // Example pricing logic (you can change this)
    const baseRate = 150;
    const weightRate = weight * 0.05;
    const lengthRate = length * 2;

    return (baseRate + weightRate + lengthRate).toFixed(2);
  }, [loadWeight, loadLength]);

  const handleAddToCart = () => {
    const bookingData = {
      pickupAddress,
      dropoffAddress,
      loadWeight,
      loadLength,
      additionalInfo,
      price,
    };

    console.log("Freight Booking Added:", bookingData);

    // You can replace this with actual cart logic
    alert("Freight booking added to cart!");
  };

  return (
    <div className="fbo-overlay-backdrop" onClick={onClose}>
      <div
        className="fbo-overlay-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fbo-header">
          <h2>Book Freight</h2>
          <button className="fbo-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="fbo-content">
          <div className="dummy-rate">
            <strong>Rate per Mile:</strong> $3.50 / mi
          </div>
          <label>Pickup Address</label>
          <input
            type="text"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            placeholder="Enter pickup address"
          />

          <label>Drop-Off Address</label>
          <input
            type="text"
            value={dropoffAddress}
            onChange={(e) => setDropoffAddress(e.target.value)}
            placeholder="Enter drop-off address"
          />

          <label>Load Weight (lbs)</label>
          <input
            type="number"
            value={loadWeight}
            onChange={(e) => setLoadWeight(e.target.value)}
            placeholder="Enter load weight"
          />

          <label>Load Length (ft)</label>
          <input
            type="number"
            value={loadLength}
            onChange={(e) => setLoadLength(e.target.value)}
            placeholder="Enter load length"
          />

          <label>Additional Information</label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Enter any special instructions"
          />
        </div>

        <div className="fbo-footer">
          <div className="fbo-price">${price}</div>
          <div className="add-to-cart-wrapper">
            <button
              className="addtoCart1"
              onClick={handleAddToCart}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreightBookingOverlay;