import { useEffect } from "react";
import { db } from "../../Components/firebase"; // adjust path
import { collection, doc, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

function SendNotificationAnnouncement({ userId, title = "Announcement Title", message = "Announcement Message" }) {
  useEffect(() => {
    const sendAnnouncement = async () => {
      try {
        let users = [];

        if (userId) {
          // Send to a single user
          const userRef = doc(db, "Users", userId);
          users.push(userRef);
        } else {
          // Send to all users
          const usersSnap = await getDocs(collection(db, "Users"));
          usersSnap.forEach((userDoc) => {
            users.push(doc(db, "Users", userDoc.id));
          });
        }

        // Loop through each user and add notification
        for (const userRef of users) {
          await addDoc(
            collection(userRef, "notifications"),
            {
              type: "announcement",
              title,
              from: "Vrumies",
              message,
              link: "",
              read: false,
              createdAt: serverTimestamp(),
            }
          );
        }

        console.log("Announcement notification sent!");
      } catch (err) {
        console.error("Error sending announcement:", err);
      }
    };

    sendAnnouncement();
  }, [userId, title, message]);

  return null; // does not render anything
}

export default SendNotificationAnnouncement;
