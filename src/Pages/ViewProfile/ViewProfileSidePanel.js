import React, { useState, useEffect } from "react";
import "./ViewProfileSidePanel.css";
import { FaStar, FaExpand } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { db } from "../../Components/firebase";
import { getAuth } from "firebase/auth";
import { addDoc, doc, getDoc, collection, query, where, getDocs, setDoc, serverTimestamp } from "firebase/firestore";
import ProfileRating from "../../Components/Reviews/ProfileRating";
import { useFollow } from "../../Hooks/useFollow";
import { useNavigate } from "react-router-dom";

const ViewProfileSidePanel = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const currentUserId = currentUser ? currentUser.uid : null;
  const { userId } = useParams(); // Grab the userId from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isFollowing, toggleFollow, loading: followLoading } = useFollow(currentUserId, userId);
  const self = currentUserId == userId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      try {
        const userRef = doc(db, "Users", userId);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setUser(snap.data());
        } else {
          console.warn("User not found");
          setUser(null);
        }

      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading)
    return (
      <div className="vpsp-profile-card">
        <p style={{ color: "white", textAlign: "center" }}>Loading...</p>
      </div>
    );

  if (!user)
    return (
      <div className="vpsp-profile-card">
        <p style={{ color: "white", textAlign: "center" }}>User not found</p>
      </div>
    );

  const handleMessageUser = async () => {
    if (!currentUserId || !userId) return;

    try {
      const userRef = doc(db, "Users", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.warn("User not found");
        return;
      }

      const chatsRef = collection(db, "chats");

      const q = query(
        chatsRef,
        where("participants", "array-contains", currentUserId)
      );

      const snapshot = await getDocs(q);

      let chatId = null;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        if (data.participants.includes(userId)) {
          chatId = docSnap.id;
        }
      });

      if (!chatId) {
        const newChatRef = await addDoc(chatsRef, {
          userA: currentUserId,
          userB: userId,
          participants: [currentUserId, userId],
          lastMessage: "",
          lastTimestamp: serverTimestamp(),
        });

        chatId = newChatRef.id;

        await addDoc(collection(db, "chats", chatId, "messages"), {
          senderId: currentUserId,
          text: "👋 Hello!",
          timestamp: serverTimestamp(),
          photos: [],
          seenBy: [currentUserId],
        });

        await setDoc(
          doc(db, "chats", chatId),
          {
            lastMessage: "👋 Hello!",
            lastTimestamp: serverTimestamp(),
          },
          { merge: true }
        );
      }

      navigate(`/inbox?chat=${chatId}`);

    } catch (err) {
      console.error("Error creating message:", err);
    }
  };

  return (
    <div className="vpsp-profile-card">
      {/* Profile image */}
      <div className="vpsp-profile-image-wrapper">
        <img
          src={user?.profilepic || `${process.env.PUBLIC_URL}/default-profile.png`}
          alt={user.username}
          className="vpsp-profile-image"
          onError={(e) => {
            e.target.src = `${process.env.PUBLIC_URL}/default-profile.png`;
          }}
        />
        <FaExpand
          className="vpsp-maximize-icon"
          onClick={() => window.open(user.profilepic, "_blank")}
        />
      </div>

      {/* Username */}
      <div className="vpsp-profile-name">
        <span className="vpsp-first-name">{user.username}</span>
      </div>

      {/* Email */}
      <div className="vpsp-profile-email">{user.email}</div>

      {/* Stars */}
      <div className="vpsp-stars">
        <ProfileRating userId={userId} />
      </div>

      {/* Buttons */}
      <div className="vpsp-button-stack">
        <button
          className={`vpsp-action-btn vpsp-follow-btn ${
            isFollowing ? "following" : ""
          }`}
          onClick={toggleFollow}
          disabled={followLoading || self}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
        <button
          className="vpsp-action-btn"
          onClick={handleMessageUser}
          disabled={self}
        >
          Message Me
        </button>
        <button className="vpsp-action-btn">Share Profile</button>
      </div>

      {/* About section */}
      <div className="vpsp-about-section">
        <div className="vpsp-about-header">About me</div>
        <p className="vpsp-about-text">
          {user.aboutme && user.aboutme.trim() !== ""
            ? user.aboutme
            : "No bio yet."}
        </p>
      </div>
    </div>
  );
};

export default ViewProfileSidePanel;
