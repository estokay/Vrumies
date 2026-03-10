import { db } from "../Components/firebase"; // adjust path
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export const handleCheckAffiliateLink = async (
  currentUserId,
  currentPostId,
  category,
  referralCode,
  forceNew = false
) => {
  if (!currentUserId || !currentPostId || !category || !referralCode) {
    throw new Error("Missing required parameters");
  }

  const categoryMap = {
    market: "marketpost",
    directory: "directorypost",
    offer: "offerpost",
    trucks: "truckpost",
  };
  const path = categoryMap[category] || `${category}post`;

  try {
    const affiliateRef = collection(db, "AffiliateLinks");

    const q = query(
      affiliateRef,
      where("userId", "==", currentUserId),
      where("postId", "==", currentPostId)
    );

    const querySnapshot = await getDocs(q);

    // ✅ If link already exists → return it
    if (!querySnapshot.empty && !forceNew) {
      const existingDoc = querySnapshot.docs[0];
      return existingDoc.data().affiliateLink;
    }

    if (!querySnapshot.empty && forceNew) {
      const existingDoc = querySnapshot.docs[0];

      const newAffiliateLink = `${window.location.origin}/Vrumies#/${path}/${currentPostId}?ref=${referralCode}`;

      await updateDoc(existingDoc.ref, {
        affiliateLink: newAffiliateLink,
        createdAt: serverTimestamp(),
      });

      return newAffiliateLink;
    }

    // ❌ If not found → create new link
    const newAffiliateLink = `${window.location.origin}/Vrumies#/${path}/${currentPostId}?ref=${referralCode}`;

    await addDoc(affiliateRef, {
      userId: currentUserId,
      postId: currentPostId,
      createdAt: serverTimestamp(),
      affiliateLink: newAffiliateLink
    });

    return newAffiliateLink;
  } catch (error) {
    console.error("Error checking/creating affiliate link:", error);
    throw error;
  }
};