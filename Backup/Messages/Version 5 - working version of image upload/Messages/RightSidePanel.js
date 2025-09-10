import React, { useEffect, useState } from "react";
import "./RightSidePanel.css";
import { db } from "../../Components/firebase";
import { doc, getDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../AuthContext";

const RightSidePanel = ({ activeChat }) => {
  const { currentUser } = useAuth();
  const [otherUser, setOtherUser] = useState(null);
  const [media, setMedia] = useState([]);

  useEffect(() => {
    if (!activeChat || !currentUser) return;

    const fetchChatInfo = async () => {
      try {
        // Fetch chat participants
        const chatDoc = await getDoc(doc(db, "chats", activeChat));
        if (!chatDoc.exists()) return;

        const data = chatDoc.data();
        const otherUserId = data.userA === currentUser.uid ? data.userB : data.userA;

        const userSnap = await getDoc(doc(db, "Users", otherUserId));
        if (userSnap.exists()) setOtherUser(userSnap.data());
        else
          setOtherUser({
            username: "Unknown",
            profilepic: `${process.env.PUBLIC_URL}/default-profile.png`,
          });

        // Listen for all messages in this chat in real time
        const messagesRef = collection(db, "chats", activeChat, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const imgs = [];
          snapshot.docs.forEach((doc) => {
            const msg = doc.data();
            if (msg.photos && msg.photos.length > 0) {
              imgs.push(...msg.photos);
            }
          });
          setMedia(imgs);
        });

        return unsubscribe;
      } catch (err) {
        console.error("Error fetching chat info:", err);
      }
    };

    const unsub = fetchChatInfo();
    return () => {
      if (unsub && typeof unsub === "function") unsub();
    };
  }, [activeChat, currentUser]);

  if (!activeChat) return null;

  return (
    <div className="rsp-panel">
      {otherUser && (
        <div className="rsp-profile-header">
          <div className="rsp-profile-pic-wrapper">
            <img
              src={otherUser.profilepic}
              alt={otherUser.username}
              className="rsp-profile-pic"
            />
            <span className="rsp-online-dot"></span>
          </div>
          <h3 className="rsp-profile-name">{otherUser.username}</h3>
        </div>
      )}

      <h4 className="rsp-media-title">Chat Media</h4>
      <div className="rsp-media-grid">
        {media.length > 0 ? (
          media.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Media ${index + 1}`}
              className="rsp-media-item"
            />
          ))
        ) : (
          <p style={{ color: "#aaa" }}>No media in this chat.</p>
        )}
      </div>

      <button className="rsp-block-button">Block</button>
    </div>
  );
};

export default RightSidePanel;
