import { useCallback, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../Components/firebase"; // adjust path if needed

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
      if (!orderId) {
        throw new Error("orderId is required");
      }

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        const orderRef = doc(db, "Orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
          throw new Error("Order not found");
        }

        const orderData = orderSnap.data();
        const updates = {};

        // ================= BUYER LOGIC =================
        if (
          buyerPressedCompleted !== undefined ||
          buyerPressedDispute !== undefined
        ) {
          const buyerId = orderData?.buyerInfo?.buyerId;

          if (user.uid !== buyerId) {
            throw new Error("Not authorized as buyer");
          }

          if (buyerPressedCompleted !== undefined) {
            updates["buyerInfo.buyerMarkedCompleted"] =
              buyerPressedCompleted;
          }

          if (buyerPressedDispute !== undefined) {
            updates["buyerInfo.buyerDispute"] =
              buyerPressedDispute;
          }
        }

        // ================= SELLER LOGIC =================
        if (
          sellerPressedCompleted !== undefined ||
          sellerPressedDispute !== undefined
        ) {
          const sellerId = orderData?.sellerInfo?.sellerId;

          if (user.uid !== sellerId) {
            throw new Error("Not authorized as seller");
          }

          if (sellerPressedCompleted !== undefined) {
            updates["sellerInfo.sellerMarkedCompleted"] =
              sellerPressedCompleted;
          }

          if (sellerPressedDispute !== undefined) {
            updates["sellerInfo.sellerDispute"] =
              sellerPressedDispute;
          }
        }

        if (Object.keys(updates).length === 0) {
          throw new Error("No valid fields provided for update");
        }

        await updateDoc(orderRef, updates);

        setLoading(false);
        return true;
      } catch (err) {
        console.error("Error updating order status:", err);
        setError(err.message);
        setLoading(false);
        return false;
      }
    },
    []
  );

  return { setOrderStatus, loading, error };
}