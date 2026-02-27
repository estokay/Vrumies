import { useEffect, useState } from "react";
import { db } from "../Components/firebase"; // adjust path if needed
import { doc, getDoc } from "firebase/firestore";

/**
 * Hook: useSellerProfilePic
 * Returns the profile picture URL of the seller for a given postId
 */
function useSellerProfilePic(postId) {
  const [profilePic, setProfilePic] = useState(`${process.env.PUBLIC_URL}/default-profile.png`);

  useEffect(() => {
    const fetchProfilePic = async () => {
      if (!postId) return;

      try {
        // 1. Get the post
        const postRef = doc(db, "Posts", postId);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) {
          setProfilePic(`${process.env.PUBLIC_URL}/default-profile.png`);
          return;
        }
        const postData = postSnap.data();

        // 2. Get the seller/user
        const userRef = doc(db, "Users", postData.userId);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          setProfilePic(`${process.env.PUBLIC_URL}/default-profile.png`);
          return;
        }

        setProfilePic(userSnap.data().profilepic || `${process.env.PUBLIC_URL}/default-profile.png`);
      } catch (err) {
        console.error("Error fetching seller profile pic:", err);
        setProfilePic(`${process.env.PUBLIC_URL}/default-profile.png`);
      }
    };

    fetchProfilePic();
  }, [postId]);

  return profilePic;
}

export default useSellerProfilePic;