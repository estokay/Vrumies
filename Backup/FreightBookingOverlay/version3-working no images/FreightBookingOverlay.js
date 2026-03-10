import React, { useState, useEffect, useRef, useMemo } from "react";
import "./FreightBookingOverlay.css";
import { GOOGLE_API_KEY } from "../../Components/config";
import useGetFreightBookingPrice from "../../CloudFunctions/useGetFreightBookingPrice";

const FreightBookingOverlay = ({ onClose, onAddFreightToCart, rpm = 5, loadWeightMax = 5000, loadLengthMax = 6000}) => {
  const [pickupInput, setPickupInput] = useState("");
  const [dropoffInput, setDropoffInput] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [pickupAddress, setPickupAddress] = useState([]);
  const [dropoffAddress, setDropoffAddress] = useState([]);
  const [loadWeight, setLoadWeight] = useState("");
  const [loadLength, setLoadLength] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const autocompleteServiceRef = useRef(null);

  
  const [serviceReady, setServiceReady] = useState(false);
  const { price = null, distance, loading, error, fetchPrice } = useGetFreightBookingPrice();

  // Load Google Places
  useEffect(() => {
    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        setServiceReady(true);
      };
      document.body.appendChild(script);
    } else {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      setServiceReady(true);
    }
  }, []);

  useEffect(() => {
    if (pickupAddress[0] && dropoffAddress[0]) {
      fetchPrice({ pickupAddress: pickupAddress[0], dropoffAddress: dropoffAddress[0], rpm });
    }
  }, [pickupAddress, dropoffAddress, rpm, fetchPrice]);

  // ================= Autocomplete Handlers =================
  const handlePickupChange = (e) => {
    const value = e.target.value;
    setPickupInput(value);

    if (!serviceReady || !autocompleteServiceRef.current || !value) {
      setPickupSuggestions([]);
      return;
    }

    autocompleteServiceRef.current.getPlacePredictions(
      { input: value, types: ["address"], componentRestrictions: { country: "us" } },
      (predictions, status) => {
        if (status !== "OK" || !predictions) {
          setPickupSuggestions([]);
          return;
        }
        setPickupSuggestions(predictions);
      }
    );
  };

  const selectPickup = (place) => {
    setPickupAddress([place.description]);
    setPickupInput("");
    setPickupSuggestions([]);
  };

  const removePickup = () => setPickupAddress([]);

  const handleDropoffChange = (e) => {
    const value = e.target.value;
    setDropoffInput(value);

    if (!autocompleteServiceRef.current || !value) {
      setDropoffSuggestions([]);
      return;
    }

    autocompleteServiceRef.current.getPlacePredictions(
      { input: value, types: ["address"], componentRestrictions: { country: "us" } },
      (predictions, status) => {
        if (status !== "OK" || !predictions) {
          setDropoffSuggestions([]);
          return;
        }
        setDropoffSuggestions(predictions);
      }
    );
  };

  const selectDropoff = (place) => {
    setDropoffAddress([place.description]);
    setDropoffInput("");
    setDropoffSuggestions([]);
  };

  const removeDropoff = () => setDropoffAddress([]);

  const handleAddToCart = () => {
    const freightBookingInfo = {
      pickupAddress: pickupAddress[0] || "",
      dropoffAddress: dropoffAddress[0] || "",
      loadWeight,
      loadLength,
      additionalInfo,
      price,
      rpm,
      distance
    };

    if (onAddFreightToCart) {
      onAddFreightToCart(freightBookingInfo);
    }

    console.log("Freight Booking Added:", freightBookingInfo);
    //alert("Freight booking added to cart!");
    onClose();
  };

  return (
    <div className="fbo-overlay-backdrop" onClick={onClose}>
      <div className="fbo-overlay-container" onClick={(e) => e.stopPropagation()}>
        <div className="fbo-header">
          <h2>Book Freight</h2>
          <button className="fbo-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="fbo-content">
          <div className="dummy-rate">
            <strong>Rate per Mile:</strong> ${rpm.toFixed(2)} / mi
          </div>

          {/* Pickup Address */}
          <label>Pickup Address</label>
          <div className="fbo-input-wrapper">
            <input
              type="text"
              value={pickupInput}
              onChange={handlePickupChange}
              placeholder="Enter pickup address"
            />
            {pickupSuggestions.length > 0 && (
              <ul className="fbo-autocomplete-suggestions">
                {pickupSuggestions.map((s) => (
                  <li key={s.place_id} onClick={() => selectPickup(s)}>{s.description}</li>
                ))}
              </ul>
            )}
          </div>
          {pickupAddress.length > 0 && (
            <div className="fbo-chip">
              {pickupAddress[0]}
              <button type="button" className="fbo-chip-remove" onClick={removePickup}>×</button>
            </div>
          )}

          {/* Dropoff Address */}
          <label>Drop-Off Address</label>
          <div className="fbo-input-wrapper">
            <input
              type="text"
              value={dropoffInput}
              onChange={handleDropoffChange}
              placeholder="Enter drop-off address"
            />
            {dropoffSuggestions.length > 0 && (
              <ul className="fbo-autocomplete-suggestions">
                {dropoffSuggestions.map((s) => (
                  <li key={s.place_id} onClick={() => selectDropoff(s)}>{s.description}</li>
                ))}
              </ul>
            )}
          </div>
          {dropoffAddress.length > 0 && (
            <div className="fbo-chip">
              {dropoffAddress[0]}
              <button type="button" className="fbo-chip-remove" onClick={removeDropoff}>×</button>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label>Load Weight (lbs)</label>
            {loadWeightMax && (
              <span style={{ color: "yellow", fontSize: "0.9rem" }}>
                Maximum Capacity: {loadWeightMax} lbs
              </span>
            )}
          </div>
          <input
            type="number"
            value={loadWeight}
            onChange={(e) => setLoadWeight(e.target.value)}
            placeholder="Enter load weight"
          />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label>Load Length (ft)</label>
            {loadLengthMax && (
              <span style={{ color: "yellow", fontSize: "0.9rem" }}>
                Maximum Capacity: {loadLengthMax} ft
              </span>
            )}
          </div>
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
          <div className="fbo-price">${typeof price === "number" ? price.toFixed(2) : " —"}</div>
          {(!pickupAddress[0] || !dropoffAddress[0]) && (
            <div style={{ fontSize: "0.9rem", color: "#ccc", marginTop: "4px" }}>
              Enter pickup and drop-off addresses to see the price
            </div>
          )}
          <div className="add-to-cart-wrapper">
            <button 
              className="addtoCart1" 
              onClick={handleAddToCart}
              disabled={price === null || !pickupAddress[0] || !dropoffAddress[0]}
            >ADD TO CART</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreightBookingOverlay;