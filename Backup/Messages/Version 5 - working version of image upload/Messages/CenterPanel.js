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

const CLOUDINARY_UPLOAD_PRESET = "vrumies_preset";
const CLOUDINARY_CLOUD_NAME = "dmjvngk3o";

const CenterPanel = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatId = params.get("chat");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [localPreview, setLocalPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  const handleSend = async () => {
    if (!newMessage.trim() && !imageUrl) return;

    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        text: newMessage.trim(),
        photos: imageUrl ? [imageUrl] : [],
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
      setImage(null);
      setImageUrl("");
      setLocalPreview("");
      setUploadProgress(0);
      setUploadError("");
      setIsUploading(false);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setUploadError("");
    setUploadProgress(0);
    setIsUploading(true);
    setLocalPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          onUploadProgress: (event) => {
            if (event.total) {
              const progress = (event.loaded / event.total) * 100;
              setUploadProgress(progress);
            }
          },
        }
      );

      setImageUrl(res.data.secure_url);
      setUploadProgress(100);
      setIsUploading(false);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError("Image failed to upload");
      setImage(null);
      setImageUrl("");
      setLocalPreview("");
      setUploadProgress(0);
      setIsUploading(false);
    }
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
          Scroll to bottom
        </button>
      )}

      {(localPreview || imageUrl) && (
        <div className="image-preview-container">
          <div className="image-preview">
            <img src={localPreview || imageUrl} alt="Preview" />

            {isUploading && (
              <div className={`upload-status ${uploadProgress >= 100 ? "completed" : ""}`}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
                  alt="Uploading"
                />
              </div>
            )}

            <span
              className="remove-image"
              onClick={() => {
                setImage(null);
                setImageUrl("");
                setLocalPreview("");
                setUploadProgress(0);
                setUploadError("");
                setIsUploading(false);
              }}
            >
              ×
            </span>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="progress-bar-right">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      )}

      {uploadError && <div className="upload-error">{uploadError}</div>}

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
