import { useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRef } from "react";

function CreateUserReview({ sellerId, rating, comment, onSuccess }) {
  const toastCalled = useRef(false);

  useEffect(() => {
    const createReview = async () => {
      if (!sellerId || rating == null) return;

      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      const buyerId = currentUser.uid;

      try {
        await setDoc(
          doc(db, "Users", sellerId, "Reviews", buyerId),
          {
            buyerId,
            rating,
            comment: comment || "",
            createdAt: serverTimestamp(),
          },
          { merge: true } // allows updating existing review
        );

        // Notify parent that review was successful
        if (onSuccess && !toastCalled.current) {
          onSuccess();
          toastCalled.current = true;
        }
      } catch (err) {
        console.error("Error creating/updating review:", err);
      }
    };

    createReview();
  }, [sellerId, rating, comment, onSuccess]);

  return null;
}

export default CreateUserReview;
