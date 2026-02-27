import { doc, getDoc } from "firebase/firestore";
import { db } from "../Components/firebase";

export default async function getUserEmail(userId) {
  if (!userId) return null;

  try {
    const userDoc = await getDoc(doc(db, "Users", userId));
    if (userDoc.exists()) {
      return userDoc.data().email || null;
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error fetching user email:", err);
    return null;
  }
}