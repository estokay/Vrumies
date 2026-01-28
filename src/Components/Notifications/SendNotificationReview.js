import { useEffect, useRef } from "react";
import { db } from "../../Components/firebase"; // adjust path
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import useGetPostLink from "../Hooks/useGetPostLink"; // assumes GetPostLink returns string
import useGetUsername from "../Hooks/useGetUsername";

function SendNotificationReview({ sellerId, fromId, stars, reviewComment, postId }) {
  const postLink = useGetPostLink({ postId });
  const postFrom = useGetUsername({ fromId });

  const sentRef = useRef(false);
  
  useEffect(() => {
    if (sentRef.current) return;
    if (!sellerId || !postLink || !postFrom) return;

    sentRef.current = true;

    const sendNotification = async () => {
      try {
        await addDoc(
          collection(db, "Users", sellerId, "notifications"),
          {
            type: "review",
            title: `${stars} stars`, // convert number to string
            from: postFrom,
            message: reviewComment || "New review",
            link: postLink,
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
  }, [sellerId, postFrom, stars, reviewComment, sellerId, postLink]);

  return null; // does not render anything
}

export default SendNotificationReview;