import React, { useEffect, useState } from "react";
import "./MyProfileSidePanel.css";
import { FaStar, FaPen, FaCamera, FaExpand } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../Components/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export default function MyProfileSidePanel() {
  const [userData, setUserData] = useState(null);
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [userId, setUserId] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setUserId(user.uid);

          const userRef = doc(db, "Users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserData(userSnap.data());
            setAboutText(userSnap.data().aboutme || "");
          } else {
            setUserData({
              username: user.displayName,
              profilepic: user.photoURL,
              email: user.email,
            });
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setUserData(null);
      }

      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  const isLoading = !authChecked;

  const saveAboutMe = async () => {
    if (!userId) return;

    try {
      const userRef = doc(db, "Users", userId);
      await updateDoc(userRef, { aboutme: aboutText }).catch(async () => {
        await setDoc(userRef, { aboutme: aboutText }, { merge: true });
      });

      setUserData((prev) => ({ ...prev, aboutme: aboutText }));
      setEditingAbout(false);
    } catch (err) {
      console.error("Error updating about me:", err);
    }
  };

  return (
    <div className="mpsp-card">
      {isLoading ? (
        // optional: placeholder to maintain layout while loading
        <div style={{ minHeight: "400px" }} />
      ) : !userData ? (
        <p style={{ color: "white" }}>No user logged in.</p>
      ) : (
        <>
          <div className="mpsp-image-wrapper">
            <img src={userData.profilepic} alt="Profile" className="mpsp-image" />

            <FaCamera
              className="mpsp-camera-icon"
              onClick={() => alert("Change profile picture clicked")}
            />

            <FaExpand
              className="mpsp-maximize-icon"
              onClick={() => window.open(userData.profilepic, "_blank")}
            />
          </div>

          <div className="mpsp-name">
            <span className="mpsp-first-name">{userData.username || "No Name"}</span>
            <FaPen className="mpsp-edit-icon" />
          </div>

          <div className="mpsp-email">{userData.email}</div>

          <div className="mpsp-stars">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="mpsp-star" />
            ))}
          </div>

          <button className="mpsp-reviews-btn">Share Profile</button>

          <div className="mpsp-about-section">
            <div className="mpsp-about-header">
              <span>About me</span>
              {editingAbout ? (
                <button className="mpsp-edit-about" onClick={saveAboutMe}>
                  Save
                </button>
              ) : (
                <span
                  className="mpsp-edit-about"
                  onClick={() => setEditingAbout(true)}
                >
                  Edit
                </span>
              )}
            </div>

            {editingAbout ? (
              <textarea
                className="mpsp-about-input"
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
              />
            ) : (
              <p className="mpsp-about-text">
                {userData.aboutme || "No bio yet."}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
