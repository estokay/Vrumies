import React, { useState, useEffect, useRef } from "react";
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
import axios from "axios";

const CLOUDINARY_UPLOAD_PRESET = "vrumies_preset"; // replace with your preset
const CLOUDINARY_CLOUD_NAME = "dmjvngk3"; // replace with your Cloudinary cloud name

const CenterPanel = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatId = params.get("chat");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [images, setImages] = useState([]);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Detect if user scrolls up
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight > 100;
    setShowScrollBtn(isNearBottom);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!chatId || !currentUser) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);

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

  // Handle sending messages
  const handleSend = async () => {
    if ((!newMessage.trim() && images.length === 0) || !chatId || !currentUser)
      return;

    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      let uploadedImageUrls = [];

      // Upload images to Cloudinary
      for (let img of images) {
        const formData = new FormData();
        formData.append("file", img);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );

        uploadedImageUrls.push(res.data.secure_url);
      }

      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        text: newMessage.trim(),
        photos: uploadedImageUrls,
        timestamp: serverTimestamp(),
        seenBy: [currentUser.uid],
      });

      const chatDocRef = doc(db, "chats", chatId);
      await setDoc(
        chatDocRef,
        {
          lastMessage: newMessage.trim() || "📷 Image",
          lastTimestamp: serverTimestamp(),
        },
        { merge: true }
      );

      setNewMessage("");
      setImages([]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="inbox-center-panel">
      <div
        className="inbox-chat-messages"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`inbox-message ${
              msg.senderId === currentUser.uid ? "inbox-sent" : "inbox-received"
            }`}
          >
            {msg.text && <p>{msg.text}</p>}
            {msg.photos &&
              msg.photos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Uploaded ${i}`}
                  className="inbox-message-image"
                />
              ))}
            <span>
              {msg.timestamp?.toDate().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showScrollBtn && (
        <button className="scroll-to-bottom-btn" onClick={scrollToBottom}>
          Scroll to bottom.
        </button>
      )}

      <div className="inbox-chat-input">
        <img
        src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1756579580/Upload-Icon_zdgmqi.png"
        alt="Upload"
        className="image-upload-icon"
        onClick={triggerFileSelect}
        />
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default CenterPanel;
