import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../Components/firebase"; // adjust path

export default function useGetSellerBalances() {
  const [available, setAvailable] = useState(0);
  const [sent, setSent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setAvailable(0);
      setSent(0);
      setLoading(false);
      return;
    }

    const currentUserId = currentUser.uid;

    // Query all orders where sellerInfo.sellerId == currentUserId
    const colRef = collection(db, "Orders");
    const q = query(colRef, where("sellerInfo.sellerId", "==", currentUserId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          let availableSum = 0;
          let sentSum = 0;

          snapshot.docs.forEach((doc) => {
            const order = doc.data();

            // Determine order price
            let price = 0;
            if (typeof order.price === "number") {
              price = order.price;
            } else if (order.postData?.price) {
              // Remove $ if string
              const str = order.postData.price;
              price = Number(str.replace(/\$/g, "")) || 0;
            }

            // Common conditions: buyer marked complete, no disputes, seller marked complete
            const common =
              order.buyerInfo?.buyerMarkedCompleted === true &&
              order.buyerInfo?.buyerDispute === false &&
              order.sellerInfo?.sellerMarkedCompleted === true &&
              order.sellerInfo?.sellerDispute === false;

            if (common) {
              if (order.paymentInfo?.payoutTransfer === false) {
                availableSum += price;
              } else if (order.paymentInfo?.payoutTransfer === true) {
                sentSum += price;
              }
            }
          });

          setAvailable(availableSum);
          setSent(sentSum);
          setLoading(false);
        } catch (err) {
          console.error("Error calculating balances:", err);
          setError(err);
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching orders:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { available, sent, loading, error };
}