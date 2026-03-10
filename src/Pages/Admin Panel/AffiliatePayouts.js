import React, { useEffect, useState } from "react";
import { db } from "../../Components/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc
} from "firebase/firestore";
import "./AffiliatePayouts.css";
import getUserEmail from "../../AsyncFunctions/getUserEmail";

function AffiliatePayouts() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [emails, setEmails] = useState({}); // store sellerId -> email map
  const affiliateRate = 0.03;
  
  const getDaysAgo = (timestamp) => {
  if (!timestamp) return "N/A";

  // Firestore timestamps have .toDate() method
  const orderDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now - orderDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

  useEffect(() => {
    const colRef = collection(db, "Orders");

    const q = query(
      colRef,
      where("buyerInfo.buyerMarkedCompleted", "==", true),
      where("buyerInfo.buyerDispute", "==", false),
      where("sellerInfo.sellerMarkedCompleted", "==", true),
      where("sellerInfo.sellerDispute", "==", false),
      where("affiliatePayoutTransfer", "==", false)
    );

    // Make the callback async so we can await getUserEmail
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const emailMap = {};
        const data = await Promise.all(
          snapshot.docs
            .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
            .filter(order => order.affiliateLinkId != null) // filter client-side
            .map(async (orderData) => {
              const affiliateLinkId = orderData.affiliateLinkId;
              if (affiliateLinkId) {
                const affiliateDoc = await getDoc(doc(db, "AffiliateLinks", affiliateLinkId));
                const affiliateUserId = affiliateDoc.exists() ? affiliateDoc.data().userId : null;
                orderData.affiliateUserId = affiliateUserId;

                if (affiliateUserId) {
                  emailMap[affiliateUserId] = await getUserEmail(affiliateUserId);
                }
              }
              return orderData;
            })
        );

        setOrders(data);
        setEmails(emailMap);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching orders:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handlePayoutSent = async () => {
    if (!selectedOrderId) return;

    try {
      const orderRef = doc(db, "Orders", selectedOrderId);
      await updateDoc(orderRef, {
        "affiliatePayoutTransfer": true
      });

      setSelectedOrderId(null);
    } catch (err) {
      console.error("Error updating payout:", err);
      alert("Failed to update payout: " + err.message);
    }
  };

  if (loading) return <p className="loading">Loading Affiliate Payouts...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="payouts-container">
      <h1>Pending Affiliate Payouts</h1>
      {orders.length === 0 ? (
        <p>No pending payouts.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => {
            const affiliateUserId = order.affiliateUserId || "N/A";
            const affiliateUserEmail = emails[affiliateUserId] || "N/A";

            return (
              <li
                key={order.id}
                className={`order-item ${selectedOrderId === order.id ? "selected" : ""}`}
                onClick={() => setSelectedOrderId(order.id)}
              >
                <strong>Affiliate Link ID:</strong> {order.affiliateLinkId} <br />
                <strong>Affiliate User Id:</strong> {affiliateUserId || "N/A"} <br />
                <strong>Email:</strong> {affiliateUserEmail} <br />
                <strong>Order Id:</strong> {order.id || "N/A"} <br />
                <strong>Order Created:</strong> {getDaysAgo(order.orderCreated)} days ago <br />

                {order.price != null && (
                  <div>
                    <strong>Order Amount:</strong> ${order.price ?? 0} <br />
                    <strong>Affiliate Amount:</strong> ${((order.price ?? 0) * affiliateRate).toFixed(2)} <br />
                  </div>
                )}

                {order.postData?.price != null && (
                  <div>
                    <strong>Order Amount:</strong> {order.postData.price ?? 0} <br />
                    <strong>Affiliate Amount:</strong> {((order.postData.price ?? 0) * affiliateRate).toFixed(2)} <br />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {selectedOrderId && (
        <button className="payout-btn" onClick={handlePayoutSent}>
          Payout Sent
        </button>
      )}
    </div>
  );
}

export default AffiliatePayouts;