import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../Components/firebase";
import { useAuth } from "../../AuthContext";
import { FaArrowLeft } from "react-icons/fa";

import OrderList from "./OrderList";
import OrderDetailView from "./OrderDetailView";
import CreateSellerPostOverlayMobile from "../../CreateSellerPostMobile/CreateSellerPostOverlayMobile";

// RESTORED hooks
import useGetSellerBalances from "../../Hooks/useGetSellerBalances";
import useGetUsername from "../../Hooks/useGetUsername";
import useGetUserEmail from "../../Hooks/useGetUserEmail";

import PayoutView from "./PayoutView";

import "./SellerPageMobile.css";

export default function SellerPageMobile() {
  const { currentUser } = useAuth();

  const [view, setView] = useState("list"); // list | detail | payout
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateOverlay, setShowCreateOverlay] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "Orders"),
      where("sellerInfo.sellerId", "==", currentUser.uid),
      where("paymentInfo.paymentSuccessful", "==", true)
    );

    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ RESTORED SORT
      arr.sort(
        (a, b) =>
          (b.orderCreated?.seconds || 0) -
          (a.orderCreated?.seconds || 0)
      );

      setOrders(arr);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="spm-auth-error">
        Please log in to view your orders.
      </div>
    );
  }

  return (
    <div className="spm-container">

      {/* HEADER */}
      {view === "list" && (
        <div className="spm-header">
          <div className="spm-header-top">
            <h1 className="spm-title">
              <span className="spm-green">SELLER</span>
            </h1>

            {/* ✅ RESTORED */}
            <button
              className="spm-payout-btn"
              onClick={() => setView("payout")}
            >
              Balances
            </button>
          </div>

          <button
            className="spm-create-btn"
            onClick={() => setShowCreateOverlay(true)}
          >
            + Create Sell Post
          </button>
        </div>
      )}

      {/* CONTENT */}
      <div className="spm-content">
        {loading && view === "list" ? (
          <div className="spm-loader">Loading Orders...</div>
        ) : (
          <>
            {view === "list" && (
              <OrderList
                orders={orders}
                onCardClick={(order) => {
                  setSelectedOrder(order);
                  setView("detail");
                }}
              />
            )}

            {view === "detail" && (
              <OrderDetailView
                order={selectedOrder}
                onBack={() => {
                  setSelectedOrder(null);
                  setView("list");
                }}
              />
            )}

            {/* ✅ RESTORED */}
            {view === "payout" && (
              <PayoutView
                userId={currentUser.uid}
                onBack={() => setView("list")}
              />
            )}
          </>
        )}
      </div>

      {showCreateOverlay && (
        <CreateSellerPostOverlayMobile
          isOpen={showCreateOverlay}
          onClose={() => setShowCreateOverlay(false)}
        />
      )}
    </div>
  );
}