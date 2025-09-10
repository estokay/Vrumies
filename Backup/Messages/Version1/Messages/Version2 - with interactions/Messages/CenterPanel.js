import React, { useState, useEffect } from "react";
import "./CenterPanel.css";
import { useLocation } from "react-router-dom";
import { db } from "../../Components/firebase";
import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuth } from "../../AuthContext";

const CenterPanel = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatId = params.get("chat");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!chatId || !currentUser) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);

      // Mark unseen messages as seen
      snapshot.docs.forEach((docSnap) => {
        const msgData = docSnap.data();
        if (!msgData.seenBy?.includes(currentUser.uid)) {
          updateDoc(doc(db, "chats", chatId, "messages", docSnap.id), {
            seenBy: arrayUnion(currentUser.uid),
          }).catch(console.error);
        }
      });
    });

    return () => unsubscribe();
  }, [chatId, currentUser]);

  const handleSend = async () => {
    if (!newMessage.trim() || !chatId || !currentUser) return;

    try {
      const messagesRef = collection(db, "chats", chatId, "messages");

      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        text: newMessage.trim(),
        timestamp: serverTimestamp(),
        photos: [],
        seenBy: [currentUser.uid],
      });

      const chatDocRef = doc(db, "chats", chatId);
      await setDoc(
        chatDocRef,
        {
          lastMessage: newMessage.trim(),
          lastTimestamp: serverTimestamp(),
        },
        { merge: true }
      );

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="inbox-center-panel">
      <div className="inbox-chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`inbox-message ${
              msg.senderId === currentUser.uid ? "inbox-sent" : "inbox-received"
            }`}
          >
            <p>{msg.text}</p>
            <span>
              {msg.timestamp?.toDate().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
        <div className="inbox-typing-indicator">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>

      <div className="inbox-chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default CenterPanel;
