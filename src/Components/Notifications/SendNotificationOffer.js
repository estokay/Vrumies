import { useEffect, useRef } from "react";
import { db } from "../../Components/firebase"; // adjust path
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import useGetPostTitle from "../Hooks/useGetPostTitle"; // assumes it returns a string
import useGetPostLink from "../Hooks/useGetPostLink";   // assumes it returns a string
import useGetUsername from "../Hooks/useGetUsername";

function SendNotificationOffer({ sellerId, fromId, postId, offerPostId }) {
  
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    if (!sellerId || !postId || !offerPostId) return;

    sentRef.current = true;

    const sendNotification = async () => {
      try {
        // Get strings from your helper components
        const title = useGetPostTitle({ postId });       // original post title
        const message = useGetPostTitle({ postId: offerPostId }); // offer post title
        const link = useGetPostLink({ postId: offerPostId });     // link to offer post
        const from = useGetUsername(fromId);

        await addDoc(
          collection(db, "Users", sellerId, "notifications"),
          {
            type: "offer",
            title: title || "New offer",
            from: from,
            message: message || "You received an offer",
            link: link || "",
            read: false,
            createdAt: serverTimestamp(),
          }
        );

        console.log("Offer notification sent!");
      } catch (err) {
        console.error("Error sending offer notification:", err);
      }
    };

    sendNotification();
  }, [sellerId, fromId, postId, offerPostId]);

  return null; // does not render anything
}

export default SendNotificationOffer;