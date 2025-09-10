import React, { useEffect, useState } from "react";
import { db } from "../../../Components/firebase";
import { collection, getDocs } from "firebase/firestore";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const colRef = collection(db, "Orders");
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p style={{ color: "white" }}>Loading Orders...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: 20, color: "white", background: "#222" }}>
      <h1>Firestore Orders</h1>
      <pre
        style={{
          background: "#111",
          padding: 10,
          borderRadius: 5,
          maxHeight: "80vh",
          overflowY: "scroll",
        }}
      >
        {JSON.stringify(orders, null, 2)}
      </pre>
    </div>
  );
}

export default Orders;
