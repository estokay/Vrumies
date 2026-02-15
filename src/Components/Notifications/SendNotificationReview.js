import { useEffect, useRef } from "react";
import { db } from "../../Components/firebase"; // adjust path
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import useGetUsername from "../Hooks/useGetUsername";

function SendNotificationReview({ sellerId, fromId, stars, reviewComment }) {
  const reviewerName = useGetUsername(fromId);

  const sentRef = useRef(false);
  
  useEffect(() => {
    if (sentRef.current) return;
    if (!sellerId || !reviewerName || !stars) return;

    sentRef.current = true;

    const sendNotification = async () => {
      try {
        await addDoc(
          collection(db, "Users", sellerId, "notifications"),
          {
            type: "review",
            title: `${stars} stars`, // convert number to string
            from: reviewerName,
            message: reviewComment || "New review",
            link: "/myreviews",
            read: false,
            createdAt: serverTimestamp(),
          }
        );

        console.log("Review notification sent!");
      } catch (err) {
        console.error("Error sending review notification:", err);
      }
    };

    sendNotification();
  }, [sellerId, reviewerName, stars, reviewComment]);

  return null; // does not render anything
}

export default SendNotificationReview;