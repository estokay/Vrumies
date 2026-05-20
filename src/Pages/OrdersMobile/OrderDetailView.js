import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Components/firebase";
import { FaArrowLeft } from "react-icons/fa";
import useSetOrderStatus from "../../CloudFunctions/useSetOrderStatus";
import OrderStatusTimeline from "../../Components/Orders/OrderStatusTimeline";
import checkPrice from "../../Functions/checkPrice";
import "./OrderDetailView.css";

export default function OrderDetailView({ order: initialOrder, onBack }) {
  const [order, setOrder] = useState(initialOrder);
  const [sellerName, setSellerName] = useState("N/A");
  const { setOrderStatus, loading } = useSetOrderStatus();

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  useEffect(() => {
    const fetchSeller = async () => {
      if (!order?.sellerInfo?.sellerId) return;
      const snap = await getDoc(doc(db, "Users", order.sellerInfo.sellerId));
      if (snap.exists()) setSellerName(snap.data().username || "N/A");
    };
    fetchSeller();
  }, [order]);

  const handleAction = async (type) => {
    const payload = { orderId: order.id };

    if (type === "complete") payload.buyerPressedCompleted = true;
    if (type === "dispute") payload.buyerPressedDispute = true;

    const result = await setOrderStatus(payload);

    if (result?.success) {
      setOrder((prev) => ({
        ...prev,
        buyerInfo: {
          ...prev.buyerInfo,
          buyerMarkedCompleted:
            type === "complete" ? true : prev.buyerInfo?.buyerMarkedCompleted,
          buyerDispute:
            type === "dispute" ? true : prev.buyerInfo?.buyerDispute,
        },
      }));
    }
  };

  if (!order) return <div className="bd-container">Loading...</div>;

  const price = checkPrice(order?.price || 0);
  const fee = (price * 0.15).toFixed(2);
  const total = (parseFloat(price) + parseFloat(fee)).toFixed(2);

  const quoteImages = order.directorySpecific?.quoteImages || [];
  const vehicleInfo = order.directorySpecific?.vehicleInfo || {};
  const additionalInfo = order.directorySpecific?.additionalInfo || "N/A";

  return (
    <div className="bd-container">
      <nav className="bd-nav">
        <button onClick={onBack} className="bd-back"><FaArrowLeft /> Back</button>
        <div className="bd-id-badge">ID: {order.id}</div>
      </nav>

      <section className="bd-section">
        <h3>Post Information</h3>

        <h2 className="bd-title">{order.postData?.title}</h2>

        <div className="bd-item-card">
          {order.postData?.images?.[0] && (
            <img 
              src={order.postData.images[0]} 
              alt="Product" 
              className="bd-image" 
            />
          )}

          <div className="bd-summary">
            <p>
              <strong>Date:</strong>{" "}
              {order.orderCreated?.toDate?.().toLocaleDateString() || "N/A"}
            </p>

            <p>
              <strong>Type:</strong>{" "}
              <span className="bd-type-tag">
                {order.type?.toUpperCase() || "N/A"}
              </span>
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {order.postData?.description || "N/A"}
            </p>

            {/* DIRECTORY ONLY */}
            {order.type === "directory" && (
              <>
                <p>
                  <strong>Service Location:</strong>{" "}
                  {order.postData?.serviceLocation || "N/A"}
                </p>

                <p>
                  <strong>Service Address:</strong>{" "}
                  {order.deliveryInfo &&
                  (
                    order.deliveryInfo.deliveryStreetAddress ||
                    order.deliveryInfo.deliveryCity ||
                    order.deliveryInfo.deliveryState ||
                    order.deliveryInfo.deliveryZipCode
                  )
                    ? `${order.deliveryInfo.deliveryStreetAddress || ""}${
                        order.deliveryInfo.deliveryStreetAddress ? ", " : ""
                      }${order.deliveryInfo.deliveryCity || ""}${
                        order.deliveryInfo.deliveryCity ? " " : ""
                      }${order.deliveryInfo.deliveryState || ""}${
                        order.deliveryInfo.deliveryState ? " " : ""
                      }${order.deliveryInfo.deliveryZipCode || ""}`
                    : "N/A"}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* MARKET SHIPPING INFO */}
      {order.type === "market" && (
        <section className="bd-section">
          <h3>Shipping Information</h3>

          <div className="bd-shipping-group">
            <strong>Shipping Address</strong>

            <p>
              {order.deliveryInfo &&
              (
                order.deliveryInfo.deliveryStreetAddress ||
                order.deliveryInfo.deliveryCity ||
                order.deliveryInfo.deliveryState ||
                order.deliveryInfo.deliveryZipCode
              )
                ? `${order.deliveryInfo.deliveryStreetAddress || ""}${
                    order.deliveryInfo.deliveryStreetAddress ? ", " : ""
                  }${order.deliveryInfo.deliveryCity || ""}${
                    order.deliveryInfo.deliveryCity ? " " : ""
                  }${order.deliveryInfo.deliveryState || ""}${
                    order.deliveryInfo.deliveryState ? " " : ""
                  }${order.deliveryInfo.deliveryZipCode || ""}`
                : "N/A"}
            </p>
          </div>

          <div className="bd-shipping-row">
            <div className="bd-shipping-group">
              <strong>Carrier</strong>
              <p>{order.marketSpecific?.Carrier || "N/A"}</p>
            </div>

            <div className="bd-shipping-group">
              <strong>Tracking Number</strong>
              <p>{order.marketSpecific?.trackingNumber || "N/A"}</p>
            </div>
        </div>
        </section>
      )}

            {/* TRUCKS FREIGHT LOGISTICS */}
      {order.type === "trucks" && (
        <section className="bd-section">
          <h3>Freight Logistics</h3>

          <div className="bd-grid">
            <div>
              <strong>Pickup</strong>
              <p>{order.trucksSpecific?.pickupAddress || "N/A"}</p>
            </div>

            <div>
              <strong>Drop-off</strong>
              <p>{order.trucksSpecific?.dropoffAddress || "N/A"}</p>
            </div>

            <div>
              <strong>Weight</strong>
              <p>
                {order.trucksSpecific?.loadWeight
                  ? `${order.trucksSpecific.loadWeight} lbs`
                  : "N/A"}
              </p>
            </div>

            <div>
              <strong>Length</strong>
              <p>
                {order.trucksSpecific?.loadLength
                  ? `${order.trucksSpecific.loadLength} ft`
                  : "N/A"}
              </p>
            </div>

            <div>
              <strong>Distance</strong>
              <p>
                {order.trucksSpecific?.distance
                  ? `${order.trucksSpecific.distance} miles`
                  : "N/A"}
              </p>
            </div>

            <div>
              <strong>RPM</strong>
              <p>
                {typeof order.trucksSpecific?.rpm === "number"
                  ? `$${order.trucksSpecific.rpm.toFixed(2)}`
                  : "N/A"}
              </p>
            </div>
          </div>
        </section>
      )}

      {order.type === "directory" && (
        <section className="bd-section">
          <h3>Quote Information</h3>

          {/* Vehicle Info */}
          <div className="bd-quote-vehicle">
            <strong>Vehicle</strong>
            <p>
              {vehicleInfo?.year ||
              vehicleInfo?.make ||
              vehicleInfo?.model ||
              vehicleInfo?.trim
                ? `${vehicleInfo?.year || ""} ${vehicleInfo?.make || ""} ${
                    vehicleInfo?.model || ""
                  } ${vehicleInfo?.trim || ""}`.trim()
                : "N/A"}
            </p>
          </div>

          {/* Additional Info */}
          <div className="bd-quote-additional">
            <strong>Additional Information</strong>
            <p>{additionalInfo}</p>
          </div>

          {/* Images */}
          {quoteImages.length > 0 && (
            <div className="bd-quote-images">
              <strong>Quote Images</strong>

              <div className="bd-quote-image-grid">
                {quoteImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`quote-${idx}`}
                    className="bd-quote-image"
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="bd-section">
        <h3>Seller Info</h3>
        <div className="bd-data-row">
          <span>Username:</span> <strong>{sellerName}</strong>
        </div>
      </section>

      <section className="bd-section">
        <h3>Payment & Status</h3>
        <div className="bd-payment-summary">
          <p>Price: ${price.toFixed(2)}</p>
          <p>Fee: ${fee}</p>
          <p className="bd-total">Total: ${total}</p>
        </div>
        
        <OrderStatusTimeline postId={order.id} orderSide="buyer" />

        <div className="bd-actions">
          {!order.buyerInfo?.buyerMarkedCompleted &&
          !order.buyerInfo?.buyerDispute &&
          !order.sellerInfo?.sellerDispute && (
            <button
              className="bd-btn-complete"
              onClick={() => handleAction("complete")}
              disabled={loading}
            >
              {loading ? "Processing..." : "Mark as Completed"}
            </button>
          )}

          {order.buyerInfo?.buyerMarkedCompleted && (
            <button className="bd-btn-completed" disabled>
              ✓ Marked Completed
            </button>
          )}

          {!order.buyerInfo?.buyerDispute &&
          !order.buyerInfo?.buyerMarkedCompleted && (
            <button
              className="bd-btn-dispute"
              onClick={() => handleAction("dispute")}
              disabled={loading}
            >
              {loading ? "Processing..." : "Dispute"}
            </button>
          )}

          {order.buyerInfo?.buyerDispute && (
            <button className="bd-btn-disputed" disabled>
              ⚠ Disputed Order
            </button>
          )}
        </div>
      </section>
    </div>
  );
}