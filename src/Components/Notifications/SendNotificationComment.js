import { useEffect, useRef } from "react";
import { db } from "../../Components/firebase"; // adjust path
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import useGetPostTitle from "../Hooks/useGetPostTitle";
import useGetPostLink from "../Hooks/useGetPostLink";
import useGetUsername from "../Hooks/useGetUsername";

function SendNotificationComment({ sellerId, fromId, postId, comment }) {
  const postTitle = useGetPostTitle({ postId });
  const postLink = useGetPostLink({ postId });
  const postFrom = useGetUsername(fromId);
  
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    if (!sellerId || !postId || !postTitle || !postFrom) return;

    sentRef.current = true;

    const sendNotification = async () => {
      try {
        await addDoc(
          collection(db, "Users", sellerId, "notifications"),
          {
            type: "comment",
            title: postTitle,
            from: postFrom,
            message: comment || "New comment",
            link: postLink,
            read: false,
            createdAt: serverTimestamp(),
          }
        );

        console.log("Notification sent!");
      } catch (err) {
        console.error("Error sending notification:", err);
      }
    };

    sendNotification();
  }, [sellerId, postFrom, postId, postTitle, comment]);

  return null; // This component doesn’t render anything
}

export default SendNotificationComment;