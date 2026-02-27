import { useCallback, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Components/firebase"; // adjust this path to your firebase.js

export default function useUpdateOrderStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateOrderStatus = useCallback(async (orderId) => {
    if (!orderId) return;

    setLoading(true);
    setError(null);

    try {
      const orderRef = doc(db, "Orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        throw new Error("Order not found");
      }

      const orderData = orderSnap.data();

      const orderStatus = orderData.orderStatus;
      const buyerInfo = orderData.buyerInfo || {};
      const sellerInfo = orderData.sellerInfo || {};

      const buyerCompleted = buyerInfo.buyerMarkedCompleted || false;
      const sellerCompleted = sellerInfo.sellerMarkedCompleted || false;
      const buyerDispute = buyerInfo.buyerDispute || false;
      const sellerDispute = sellerInfo.sellerDispute || false;

      let newStatus = orderStatus; // default is no change

      if (orderStatus === "dispute") {
        // do nothing
      } else if (orderStatus === "completed") {
        if (buyerDispute || sellerDispute) {
          newStatus = "disputed";
        }
      } else if (orderStatus === "in_progress") {
        if (buyerDispute || sellerDispute) {
          newStatus = "disputed";
        } else if (
          buyerCompleted &&
          !buyerDispute &&
          sellerCompleted &&
          !sellerDispute
        ) {
          newStatus = "completed";
        }
      } else if (orderStatus === "pending") {
        if (buyerDispute || sellerDispute) {
          newStatus = "disputed";
        } else if (
          buyerCompleted &&
          !buyerDispute &&
          sellerCompleted &&
          !sellerDispute
        ) {
          newStatus = "completed";
        } else if (
          (buyerCompleted && !buyerDispute && !sellerCompleted && !sellerDispute) ||
          (!buyerCompleted && !buyerDispute && sellerCompleted && !sellerDispute)
        ) {
          newStatus = "in_progress";
        }
      }

      if (newStatus !== orderStatus) {
        await updateDoc(orderRef, { orderStatus: newStatus });
      }

      setLoading(false);
      return newStatus;
    } catch (err) {
      console.error("Error updating order status:", err);
      setError(err);
      setLoading(false);
      return null;
    }
  }, []);

  return { updateOrderStatus, loading, error };
}