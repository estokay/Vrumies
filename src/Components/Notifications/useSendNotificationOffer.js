import { useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import useGetPostTitle from "../../Hooks/useGetPostTitle";
import useGetPostLink from "../../Hooks/useGetPostLink";
import useGetUsername from "../../Hooks/useGetUsername";

export default function useSendNotificationOffer({
  sellerId,
  fromId,
  postId,
  offerPostId
}) {
  const sentRef = useRef(false);

  // ✅ Hooks MUST be called at top level
  const title = useGetPostTitle({ postId });
  const message = useGetPostTitle({ postId: offerPostId });
  const link = useGetPostLink({ postId: offerPostId });
  const from = useGetUsername(fromId);

  useEffect(() => {
    if (sentRef.current) return;
    if (!sellerId || !postId || !offerPostId) return;

    if (!title || !message || !link || !from) return;

    sentRef.current = true;

    const sendNotification = async () => {
      try {
        await addDoc(
          collection(db, "Users", sellerId, "notifications"),
          {
            type: "offer",
            title: title || "New offer",
            from: from || "",
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

  }, [
    sellerId,
    postId,
    offerPostId,
    title,
    message,
    link,
    from
  ]);
}