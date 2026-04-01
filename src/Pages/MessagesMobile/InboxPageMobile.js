import React, { useEffect, useRef, useState } from "react";
import "./InboxPageMobile.css";
import { db } from "../../Components/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  orderBy,
  addDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import useGetProfilePic from "../../Hooks/useGetProfilePic";

const CLOUDINARY_UPLOAD_PRESET = "vrumies_preset";
const CLOUDINARY_CLOUD_NAME = "dmjvngk3o";

const InboxPageMobile = () => {
  const { currentUser } = useAuth();

  const [view, setView] = useState("list");
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const otherProfilePic = useGetProfilePic(otherUser?.userId);
  const [newMessage, setNewMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [localPreview, setLocalPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.uid)
    );

    const unsub = onSnapshot(q, async (snap) => {
      const chatList = await Promise.all(
        snap.docs.map(async (chatDoc) => {
          const data = chatDoc.data();
          const chatId = chatDoc.id;

          const otherId =
            data.userA === currentUser.uid ? data.userB : data.userA;

          let other = { username: "Unknown", profilepic: "", userId: otherId };

          try {
            const userSnap = await getDoc(doc(db, "Users", otherId));
            if (userSnap.exists()) {
              other = {
                userId: otherId,
                ...userSnap.data()
              };
            }
          } catch {}

          return {
            chatId,
            other,
            lastMessage: data.lastMessage || "",
            lastTimestamp: data.lastTimestamp?.toDate() || null
          };
        })
      );

      chatList.sort((a, b) => b.lastTimestamp - a.lastTimestamp);

      setChats(chatList);
    });

    return () => unsub();
  }, [currentUser]);

  useEffect(() => {
    if (!activeChat) return;

    const load = async () => {
      const chatDoc = await getDoc(doc(db, "chats", activeChat));
      const data = chatDoc.data();

      const otherId =
        data.userA === currentUser.uid ? data.userB : data.userA;

      const userSnap = await getDoc(doc(db, "Users", otherId));
      if (userSnap.exists()) {
        setOtherUser({
          userId: otherId,
          ...userSnap.data()
        });
      }
    };

    load();

    const q = query(
      collection(db, "chats", activeChat, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      setMessages(msgs);

      snap.docs.forEach((docSnap) => {
        const data = docSnap.data();
        if (!data.seenBy?.includes(currentUser.uid)) {
          updateDoc(
            doc(db, "chats", activeChat, "messages", docSnap.id),
            {
              seenBy: arrayUnion(currentUser.uid)
            }
          );
        }
      });
    });

    return () => unsub();
  }, [activeChat, currentUser]);

  useEffect(scrollBottom, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() && !imageUrl) return;

    await addDoc(collection(db, "chats", activeChat, "messages"), {
      senderId: currentUser.uid,
      text: newMessage,
      photos: imageUrl ? [imageUrl] : [],
      timestamp: serverTimestamp(),
      seenBy: [currentUser.uid]
    });

    await setDoc(
      doc(db, "chats", activeChat),
      {
        lastMessage: newMessage || "📷 Image",
        lastTimestamp: serverTimestamp()
      },
      { merge: true }
    );

    setNewMessage("");
    setImageUrl("");
    setLocalPreview("");
  };

  const ChatRow = ({ chat, onClick }) => {
    const profilePic = useGetProfilePic(chat.other.userId); // make sure you have userId

    return (
      <div className="mobileChatRow" onClick={onClick}>
        <img
          src={profilePic}
          className="mobileAvatar"
          onError={(e) => {
            const src = e.currentTarget.src;
            e.currentTarget.src = src + "?t=" + Date.now();
          }}
        />
        <div>
          <h4>{chat.other.username}</h4>
          <p>{chat.lastMessage}</p>
        </div>
      </div>
    );
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLocalPreview(URL.createObjectURL(file));
    setIsUploading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      form,
      {
        onUploadProgress: (e) => {
          setUploadProgress((e.loaded / e.total) * 100);
        }
      }
    );

    setImageUrl(res.data.secure_url);
    setIsUploading(false);
  };

  if (view === "list")
    return (
      <div className="mobileInbox">
        <h2 className="mobileTitle">Messages</h2>
          {chats.map((c) => (
            <ChatRow
              key={c.chatId}
              chat={c}
              onClick={() => {
                setActiveChat(c.chatId);
                setView("chat");
              }}
            />
          ))}
      </div>
    );

  if (view === "info")
    return (
      <div className="mobileInbox">
        <button
          className="mobileBack"
          onClick={() => setView("chat")}
        >
          Back
        </button>

        {otherUser && (
          <div className="mobileProfile">
            <img
              src={otherProfilePic}
              onError={(e) => {
                const src = e.currentTarget.src;
                e.currentTarget.src = src + "?t=" + Date.now();
              }}
            />
            <h3>{otherUser.username}</h3>
          </div>
        )}

        <div className="mobileMediaGrid">
          {messages
            .filter((m) => m.photos?.length)
            .flatMap((m) => m.photos)
            .map((url, i) => (
              <img key={i} src={url} />
            ))}
        </div>
      </div>
    );

  return (
    <div className="mobileInbox">

      <div className="mobileChatHeader">
        <button onClick={() => setView("list")}>Back</button>
        <h4>{otherUser?.username}</h4>
        <button onClick={() => setView("info")}>Info</button>
      </div>

      <div className="mobileMessages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.senderId === currentUser.uid
                ? "mobileMsgSent"
                : "mobileMsgRecv"
            }
          >
            {msg.text && <p>{msg.text}</p>}

            {msg.photos?.map((p, i) => (
              <img key={i} src={p} />
            ))}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {localPreview && (
        <div className="mobilePreview">
          <img src={localPreview} />
        </div>
      )}

      <div className="mobileInputBar">
        <button onClick={() => fileInputRef.current.click()}>
          📷
        </button>

        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message"
        />

        <button onClick={sendMessage}>Send</button>

        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept="image/*"
          onChange={uploadImage}
        />
      </div>
    </div>
  );
};

export default InboxPageMobile;