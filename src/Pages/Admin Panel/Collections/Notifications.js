import React, { useEffect, useState } from "react";
import { db } from "../../../Components/firebase";
import { collection, getDocs } from "firebase/firestore";

async function getAllUserNotifications() {
  const usersSnapshot = await getDocs(collection(db, "Users"));
  const notificationsData = {};

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const notificationsRef = collection(db, `Users/${userId}/notifications`);
    const notificationsSnapshot = await getDocs(notificationsRef);

    notificationsData[userId] = notificationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  return notificationsData;
}

function Notifications() {
  const [allNotifications, setAllNotifications] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const data = await getAllUserNotifications();
        setAllNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  if (loading) return <p style={{ color: "white" }}>Loading notifications...</p>;

  return (
    <div style={{ padding: 20, color: "white", background: "#222" }}>
      <h1>All User Notifications</h1>
      <pre
        style={{
          background: "#111",
          padding: 10,
          borderRadius: 5,
          maxHeight: "80vh",
          overflowY: "scroll",
        }}
      >
        {JSON.stringify(allNotifications, null, 2)}
      </pre>
    </div>
  );
}

export default Notifications;