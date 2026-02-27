import { useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc
} from "firebase/firestore";

function SendNotificationAnnouncement({
  userId,
  title,
  message,
  onSuccess,
  onError,
}) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;

    const sendAnnouncement = async () => {
      try {

        // 🔹 OPTION 1 — Send to ONE user
        if (userId) {
          const userRef = doc(db, "Users", userId);

          await addDoc(collection(userRef, "notifications"), {
            type: "announcement",
            title,
            from: "Vrumies",
            message,
            read: false,
            createdAt: serverTimestamp(),
          });

        } 
        // 🔹 OPTION 2 — Send to EVERYONE (global)
        else {
          await addDoc(collection(db, "Announcements"), {
            type: "announcement",
            title,
            from: "Vrumies",
            message,
            createdAt: serverTimestamp(),
          });
        }

        onSuccess?.();

      } catch (err) {
        onError?.(err);
      }
    };

    sendAnnouncement();
  }, [userId, title, message, onSuccess, onError]);

  return null;
}

export default SendNotificationAnnouncement;