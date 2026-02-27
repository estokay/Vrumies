import { useEffect, useRef } from "react";
import { db } from "../firebase"; // adjust path
import { collection, doc, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

function SendNotificationGlobal({
  userId,
  title = "Announcement Title",
  message = "Announcement Message",
  onSuccess,
  onError,
}) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;

    const sendAnnouncement = async () => {
      try {
        let users = [];

        if (userId) {
          users.push(doc(db, "Users", userId));
        } else {
          const usersSnap = await getDocs(collection(db, "Users"));
          usersSnap.forEach((userDoc) => {
            users.push(doc(db, "Users", userDoc.id));
          });
        }

        await addDoc(collection(db, "Announcements"), {
            type: "global",
            title,
            from: "Vrumies",
            message,
            createdAt: serverTimestamp(),
            });

        console.log("Announcement notification sent!");
        onSuccess?.();
      } catch (err) {
        console.error("Error sending announcement:", err);
        onError?.(err);
      }
    };

    sendAnnouncement();
  }, [userId, title, message, onSuccess, onError]);

  return null;
}

export default SendNotificationGlobal;
