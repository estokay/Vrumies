import React, { useEffect, useState } from "react";
import "./MyProfileSidePanel.css";
import { FaStar, FaPen, FaCamera, FaExpand } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../Components/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import ProfileRating from "../../Components/Reviews/ProfileRating";
import axios from "axios";
import { CLOUDINARY_CONFIG } from "../../Components/config";
import uploadGoogleProfilePic from "../../AsyncFunctions/uploadGoogleProfilePic";
import useGetProfilePic from "../../Hooks/useGetProfilePic";

export default function MyProfileSidePanel() {
  const [userData, setUserData] = useState(null);
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [userId, setUserId] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameText, setUsernameText] = useState("");
  const [uploadingPic, setUploadingPic] = useState(false);
  const [notification, setNotification] = useState("");
  const profilePic = useGetProfilePic(userId);

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
            setUsernameText(userSnap.data().username || user.displayName || "");
          } else {
            setUserData({
              username: user.displayName,
              profilepic: user.photoURL,
              email: user.email,
            });
            setUsernameText(user.displayName || "");
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

  const saveUsername = async () => {
    if (!userId) return;

    if (!usernameText.trim()) {
      alert("Username cannot be empty");
      return; // stop the function here
    }

    try {
      const userRef = doc(db, "Users", userId);
      await updateDoc(userRef, { username: usernameText }).catch(async () => {
        await setDoc(userRef, { username: usernameText }, { merge: true });
      });

      setUserData((prev) => ({ ...prev, username: usernameText }));
      setEditingUsername(false);
    } catch (err) {
      console.error("Error updating username:", err);
    }
  };

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

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    setUploadingPic(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", CLOUDINARY_CONFIG.preset);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        fd
      );

      const imageUrl = res.data.secure_url;

      const userRef = doc(db, "Users", userId);

      await updateDoc(userRef, { profilepic: imageUrl }).catch(async () => {
        await setDoc(userRef, { profilepic: imageUrl }, { merge: true });
      });

      setUserData((prev) => ({ ...prev, profilepic: imageUrl }));
    } catch (err) {
      console.error("Error uploading profile picture:", err);
    }

    setUploadingPic(false);
  };

  const handleResetProfilePic = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!userId || !currentUser?.photoURL) return;

    setUploadingPic(true);

    try {
      // 🔥 Get latest Google photo
      const googlePhoto = currentUser.photoURL;

      // 🔥 Upload to Cloudinary
      const newUrl = await uploadGoogleProfilePic(googlePhoto);

      const userRef = doc(db, "Users", userId);

      await updateDoc(userRef, { profilepic: newUrl }).catch(async () => {
        await setDoc(userRef, { profilepic: newUrl }, { merge: true });
      });

      setUserData((prev) => ({ ...prev, profilepic: newUrl }));

      showNotification("Reset to Google profile picture!", 2000);
    } catch (err) {
      console.error("Error resetting profile picture:", err);
    }

    setUploadingPic(false);
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/viewprofile/${userId}`;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(profileUrl)
        .then(() => {
          showNotification("Profile URL copied!", 2000);
        })
        .catch((err) => console.error(err));
    } else {
      alert("Clipboard API not supported.");
    }
  };

  const showNotification = (msg, duration = 2000) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), duration);
  };

  return (
    <div className="mpsp-card">
      {notification && <div className="copy-notification">{notification}</div>}
      {isLoading ? (
        // optional: placeholder to maintain layout while loading
        <div style={{ minHeight: "400px" }} />
      ) : !userData ? (
        <p style={{ color: "white" }}>No user logged in.</p>
      ) : (
        <>
          <div className="mpsp-image-wrapper">

            <img
              key={profilePic} 
              src={profilePic || `${process.env.PUBLIC_URL}/default-profile.png`} 
              alt="Profile" 
              className="mpsp-image"
              onError={(e) => {
                e.target.src = `${process.env.PUBLIC_URL}/default-profile.png`;
              }}
            />

            {/* Hidden upload input */}
            <input
              type="file"
              accept="image/*"
              id="profilePicUpload"
              style={{ display: "none" }}
              onChange={handleProfilePicUpload}
            />

            <FaCamera
              className="mpsp-camera-icon"
              onClick={() => document.getElementById("profilePicUpload").click()}
            />

            <button
              className="mpsp-reset-btn"
              onClick={handleResetProfilePic}
            >
              Reset Pic
            </button>

            <FaExpand
              className="mpsp-maximize-icon"
              onClick={() => window.open(userData.profilepic, "_blank")}
            />

            {uploadingPic && <p style={{color:"white"}}>Uploading...</p>}

          </div>

          <div className="mpsp-name">
            {editingUsername ? (
              <>
                <input
                  type="text"
                  className="mpsp-username-input"
                  value={usernameText}
                  onChange={(e) => setUsernameText(e.target.value)}
                  autoFocus
                />
                <button className="mpsp-save-btn" onClick={saveUsername}>Save</button>
              </>
            ) : (
              <>
                <span className="mpsp-first-name">{userData.username || "No Name"}</span>
                <FaPen
                  className="mpsp-edit-icon"
                  onClick={() => setEditingUsername(true)}
                />
              </>
            )}
          </div>

          <div className="mpsp-email">{userData.email}</div>

          <div className="mpsp-stars">
            <ProfileRating userId={userId} />
          </div>

          <button className="mpsp-reviews-btn" onClick={handleShareProfile}>
            Share Profile
          </button>

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
