import React, { useEffect, useState } from "react";
import "./OfferVariant.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import { db } from "../../../Components/firebase";
import { doc, getDoc } from "firebase/firestore";
import checkPrice from "../../../Functions/checkPrice";
import useSetOrderStatus from "../../../CloudFunctions/useSetOrderStatus";
import OrderStatusTimeline from "../../../Components/Orders/OrderStatusTimeline";

export default function OfferVariant({ orderId }) {
  const [order, setOrder] = useState(null);
  const [sellerName, setSellerName] = useState("N/A");
  const { setOrderStatus, loading } = useSetOrderStatus();

    const handleMarkCompleted = async () => {
    console.log("Sending payload:", {
      orderId,
      buyerPressedCompleted: true,
    });

    const result = await setOrderStatus({
      orderId,
      buyerPressedCompleted: true,
    });

    console.log("Function result:", result);

    if (result?.success) {
      setOrder((prev) => ({
        ...prev,
        buyerInfo: {
          ...prev.buyerInfo,
          buyerMarkedCompleted: true,
        },
      }));
    }
  };

  const handleDispute = async () => {
    const result = await setOrderStatus({
      orderId,
      buyerPressedDispute: true,
    });

    if (result?.success) {
      setOrder((prev) => ({
        ...prev,
        buyerInfo: {
          ...prev.buyerInfo,
          buyerDispute: true,
        },
      }));
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, "Orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const orderData = orderSnap.data();

          // Fetch seller username
          if (orderData.sellerInfo?.sellerId) {
            try {
              const sellerRef = doc(db, "Users", orderData.sellerInfo.sellerId);
              const sellerSnap = await getDoc(sellerRef);
              if (sellerSnap.exists()) {
                setSellerName(sellerSnap.data().username || "N/A");
              }
            } catch (err) {
              console.error("Error fetching seller:", err);
              setSellerName("N/A");
            }
          }

          setOrder({ id: orderSnap.id, ...orderData });
        } else {
          setOrder(null);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (!order) return <div className="oe-event-details-panel">Loading order...</div>;

  // Convert Firestore timestamp to MM/DD/YYYY
  const date = order.orderCreated?.seconds
    ? new Date(order.orderCreated.seconds * 1000).toLocaleDateString("en-US")
    : "N/A";

  const type = order.type || "N/A";
  const orderID = order.id || "N/A";

  const image = order.postData?.images?.[0] || "";
  const postId = order.postData?.postId || "N/A";
  const title = order.postData?.title || "N/A";
  const description = order.postData?.description || "N/A";
  const rawPrice = order?.price;
  const price = checkPrice(rawPrice);
  const transactionFee = (price * 0.15).toFixed(2);
  const total = (price + parseFloat(transactionFee)).toFixed(2);

  const paymentMethod = order.paymentInfo?.paymentMethod || "N/A";
  const lastFour = order.paymentInfo?.lastFour || "N/A";

  const originalPost = order.offerSpecific?.originalPostObject || {};
  const originalTitle = originalPost.title || "N/A";
  const originalDescription = originalPost.description || "N/A";
  const originalType = originalPost.type || "N/A";
  const originalTruckType = originalPost.truckType || "N/A";
  const originalPickupAddress = originalPost.pickupAddress || "N/A";
  const originalDropoffAddress = originalPost.dropoffAddress || "N/A";
  const originalPayout = originalPost.payout || 0;
  const originalWeight = originalPost.loadWeight || "N/A";
  const originalLength = originalPost.loadLength || "N/A";
  const originalAvailableDate = originalPost.availableDate || "N/A";

  return (
    <div className="oe-event-details-panel">
      <h2 className="oe-panel-title">ORDER INFORMATION</h2>

      {/* Order Details */}
      <section className="oe-section">
        <h3>Order Details</h3>
        <div className="oe-order-info">
          <div><strong>Date</strong><p>{date}</p></div>
          <div><strong>Type</strong><p>{type}</p></div>
          <div><strong>Order ID</strong><p>{orderID}</p></div>
        </div>

        
      </section>

      {/* Ordered Items */}
      <section className="oe-section">
        <h3>Ordered Items</h3>
        <div className="oe-item-card">
          {image && <img src={image} alt="Product" />}
          <div>
            <div><strong>Title</strong><p>{title}</p></div>
            <div><strong>Description</strong><p>{description}</p></div>
          </div>
        </div>
      </section>

      {/* Original Post Information */}
      <section className="oe-section">
        <h3>Original Post Information</h3>

        <div className="oe-original-post-info">

          <div>
            <strong>Title</strong>
            <p>{originalTitle}</p>
          </div>

          <div>
            <strong>Description</strong>
            <p>{originalDescription}</p>
          </div>

          <div>
            <strong>Type</strong>
            <p>{originalType}</p>
          </div>
          {originalType === "loads" && (
            <>
                <div>
                  <strong>Available Date</strong>
                  <p>{originalAvailableDate}</p>
                </div>

                <div>
                  <strong>Truck Type</strong>
                  <p>{originalTruckType}</p>
                </div>

                <div>
                  <strong>Pickup Address</strong>
                  <p>{originalPickupAddress}</p>
                </div>

                <div>
                  <strong>Dropoff Address</strong>
                  <p>{originalDropoffAddress}</p>
                </div>

                <div>
                  <strong>Load Weight</strong>
                  <p>{originalWeight} lbs</p>
                </div>

                <div>
                  <strong>Load Length</strong>
                  <p>{originalLength} ft</p>
                </div>

                <div>
                  <strong>Payout</strong>
                  <p>${originalPayout}</p>
                </div>

            </>
          )}

        </div>
      </section>

      {/* Payment Information */}
      <section className="oe-section">
        <h3>Payment Information</h3>
        <div className="oe-payment-info">
          <div>
            <strong>Price</strong><p>${price.toFixed(2)}</p>
            <strong>Transaction Fee (15%)</strong><p>${transactionFee}</p>
            <strong>Total</strong><p>${total}</p>
          </div>
          <div>
            <strong>Payment Method</strong><p>{paymentMethod}</p>
            <strong>Last 4 digits of Card</strong><p>{lastFour}</p>
          </div>
        </div>
      </section>

      {/* Seller Information */}
      <section className="oe-section">
        <h3>Seller Information</h3>
        <div><strong>Seller</strong><p>{sellerName}</p></div>
        <button className="oe-btn-message">Message User</button>
      </section>

      {/* Status */}
      <section className="oe-section">
        <h3>Status</h3>
        <OrderStatusTimeline
          postId={orderId}
          orderSide="buyer"
        />        

        <div className="oe-status-buttons">
          {!order.buyerInfo?.buyerMarkedCompleted &&
          !order.buyerInfo?.buyerDispute &&
          !order.sellerInfo?.sellerDispute && (
            <button
              className="oe-btn-complete"
              onClick={handleMarkCompleted}
              disabled={loading}
            >
              {loading ? "Processing..." : "Mark as Completed"}
            </button>
          )}

          {order.buyerInfo?.buyerMarkedCompleted && (
            <button className="oe-btn-completed" disabled>
              ✓ Marked Completed
            </button>
          )}

          {!order.buyerInfo?.buyerDispute &&
          !order.buyerInfo?.buyerMarkedCompleted && (
            <button
              className="oe-btn-dispute"
              onClick={handleDispute}
              disabled={loading}
            >
              {loading ? "Processing..." : "Dispute"}
            </button>
          )}

          {order.buyerInfo?.buyerDispute && (
            <button className="oe-btn-disputed" disabled>
              ⚠ Disputed Order
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
