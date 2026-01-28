import { useCallback, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // adjust path to your firebase.js

export default function useSetOrderStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setOrderStatus = useCallback(
    async ({
      orderId,
      buyerPressedCompleted,
      sellerPressedCompleted,
      buyerPressedDispute,
      sellerPressedDispute,
    }) => {
      if (!orderId) return;

      setLoading(true);
      setError(null);

      try {
        const orderRef = doc(db, "Orders", orderId);

        const updates = {};

        if (buyerPressedCompleted) {
          updates["buyerInfo.buyerMarketCompleted"] = true;
        }

        if (sellerPressedCompleted) {
          updates["sellerInfo.sellerMarketCompleted"] = true;
        }

        if (buyerPressedDispute) {
          updates["buyerInfo.buyerDispute"] = true;
        }

        if (sellerPressedDispute) {
          updates["sellerInfo.sellerDispute"] = true; // corrected
        }

        if (Object.keys(updates).length > 0) {
          await updateDoc(orderRef, updates);
        }

        setLoading(false);
        return true;
      } catch (err) {
        console.error("Error updating order status:", err);
        setError(err);
        setLoading(false);
        return false;
      }
    },
    []
  );

  return { setOrderStatus, loading, error };
}