import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Components/firebase";
import { useAuth } from "../AuthContext";

export default function useIsItemInCart(postId) {
  const { currentUser } = useAuth();
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || !postId) {
      setIsInCart(false);
      setLoading(false);
      return;
    }

    const cartRef = collection(db, "Users", currentUser.uid, "cart");

    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      let found = false;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.postId === postId) {
          found = true;
        }
      });

      setIsInCart(found);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, postId]);

  return { isInCart, loading };
}