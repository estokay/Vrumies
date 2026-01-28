import React, { useState } from "react";
import { db } from "../../Components/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import "./DeleteOrder.css";

export default function DeleteOrder() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleDelete = async () => {
    if (!orderId.trim()) {
      setError("Please enter an Order ID.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const orderRef = doc(db, "Orders", orderId);
      const snap = await getDoc(orderRef);

      if (!snap.exists()) {
        setError("No order found with that ID.");
        return;
      }

      await deleteDoc(orderRef);
      setSuccess(`Order ${orderId} deleted successfully.`);
    } catch (err) {
      console.error(err);
      setError("Failed to delete order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-order-container">
      <h2>Delete Order by ID</h2>

      <input
        type="text"
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        className="delete-order-input"
      />

      <button
        onClick={handleDelete}
        disabled={loading}
        className="delete-order-button"
      >
        {loading ? "Deleting..." : "Delete Order"}
      </button>

      {error && <p className="delete-order-error">{error}</p>}
      {success && <p className="delete-order-success">{success}</p>}
    </div>
  );
}
