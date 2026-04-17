import React, { useEffect, useState } from "react";
import "./LeftSidePanel.css";
import { db } from "../../Components/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import ChatItem from "./ChatItem";

const LeftSidePanel = ({ setActiveChat }) => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", currentUser.uid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatList = await Promise.all(
        snapshot.docs.map(async (chatDoc) => {
          const data = chatDoc.data();
          const chatId = chatDoc.id;

          // Determine the other user
          const otherUserId = data.userA === currentUser.uid ? data.userB : data.userA;
          let otherUser = {
            username: "Unknown",
            profilepic: null,
          };

          try {
            const userSnap = await getDoc(doc(db, "Users", otherUserId));

            if (userSnap.exists()) {
              const userData = userSnap.data();

              otherUser = {
                username: userData.username || "Unknown",
                profilepic: userData.profilepic || null,
              };
            }
          } catch (err) {
            console.error("Error fetching user:", err);
          }

          // Compute unread count in real-time
          let unreadCount = 0;
          try {
            const messagesRef = collection(db, "chats", chatId, "messages");
            const unsubscribeMsgs = onSnapshot(messagesRef, (msgsSnap) => {
              const unseen = msgsSnap.docs.filter(
                (msgDoc) => !msgDoc.data().seenBy?.includes(currentUser.uid)
              );
              setChats((prev) =>
                prev.map((c) =>
                  c.chatId === chatId ? { ...c, unreadCount: unseen.length } : c
                )
              );
            });
          } catch (err) {
            console.error("Error counting unread messages:", err);
          }

          return {
            chatId,
            otherUserId,
            otherUser,
            lastMessage: data.lastMessage || "",
            lastTimestamp: data.lastTimestamp?.toDate() || null,
            unreadCount: 0, // initial, will update live
          };
        })
      );

      chatList.sort((a, b) => {
        if (!a.lastTimestamp) return 1;
        if (!b.lastTimestamp) return -1;
        return b.lastTimestamp - a.lastTimestamp;
      });

      setChats(chatList);

      // Auto select first chat if none active
      if (chatList.length > 0 && !window.location.search.includes("chat=")) {
        const firstChat = chatList[0];
        navigate(`/inbox?chat=${firstChat.chatId}`, { replace: true });
        if (setActiveChat) setActiveChat(firstChat.chatId);
      }
    });

    return () => unsubscribe();
  }, [currentUser, navigate, setActiveChat]);

  const formatTime = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="lsp-panel">
      <input type="text" placeholder="Search username..." className="lsp-search" />
      <ul className="lsp-user-list">
        {chats.map((chat) => (
          <ChatItem
            key={chat.chatId}
            chat={chat}
            navigate={navigate}
            setActiveChat={setActiveChat}
            formatTime={formatTime}
          />
        ))}
      </ul>
    </div>
  );
};

export default LeftSidePanel;
