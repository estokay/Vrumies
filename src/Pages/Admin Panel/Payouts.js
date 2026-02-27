import React, { useEffect, useState } from "react";
import { db } from "../../Components/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc
} from "firebase/firestore";
import "./Payouts.css";
import getUserEmail from "../../AsyncFunctions/getUserEmail";

function Payouts() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [emails, setEmails] = useState({}); // store sellerId -> email map

  useEffect(() => {
    const colRef = collection(db, "Orders");

    const q = query(
      colRef,
      where("buyerInfo.buyerMarkedCompleted", "==", true),
      where("buyerInfo.buyerDispute", "==", false),
      where("sellerInfo.sellerMarkedCompleted", "==", true),
      where("sellerInfo.sellerDispute", "==", false),
      where("paymentInfo.payoutTransfer", "==", false)
    );

    // Make the callback async so we can await getUserEmail
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch all seller emails in parallel
        const emailMap = {};
        await Promise.all(
          data.map(async (order) => {
            const sellerId = order.sellerInfo?.sellerId;
            if (sellerId) {
              emailMap[sellerId] = await getUserEmail(sellerId);
            }
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
        "paymentInfo.payoutTransfer": true
      });

      setSelectedOrderId(null);
    } catch (err) {
      console.error("Error updating payout:", err);
      alert("Failed to update payout: " + err.message);
    }
  };

  if (loading) return <p className="loading">Loading Orders...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="payouts-container">
      <h1>Pending Payout Orders</h1>
      {orders.length === 0 ? (
        <p>No pending payouts.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => {
            const sellerId = order.sellerInfo?.sellerId;
            const sellerEmail = sellerId ? emails[sellerId] : "N/A";

            return (
              <li
                key={order.id}
                className={`order-item ${selectedOrderId === order.id ? "selected" : ""}`}
                onClick={() => setSelectedOrderId(order.id)}
              >
                <strong>Order ID:</strong> {order.id} <br />
                <strong>Seller Id:</strong> {sellerId || "N/A"} <br />
                <strong>Email:</strong> {sellerEmail} <br />

                {order.price != null && (
                  <div>
                    <strong>Amount:</strong> ${order.price ?? 0}
                  </div>
                )}

                {order.postData?.price != null && (
                  <div>
                    <strong>Amount:</strong> {order.postData.price ?? 0}
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

export default Payouts;