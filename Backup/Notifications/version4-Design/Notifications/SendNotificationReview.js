import { useEffect } from "react";
import { db } from "../../Components/firebase"; // adjust path
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import useGetPostLink from "../Hooks/useGetPostLink"; // assumes GetPostLink returns string
import useGetUsername from "../Hooks/useGetUsername";

function SendNotificationReview({ sellerId, fromId, stars, reviewComment, postId }) {
  useEffect(() => {
    const sendNotification = async () => {
      if (!sellerId) return;

      try {
        // Get the post link string
        const postLink = useGetPostLink({ postId }); // returns string like "/directorypost/abc123"
        const postFrom = useGetUsername({ fromId });

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
  }, [sellerId, fromId, stars, reviewComment, postId]);

  return null; // does not render anything
}

export default SendNotificationReview;