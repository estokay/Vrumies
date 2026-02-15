import { db } from "../../Components/firebase";
import { collection, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";

const sendNotificationOrder = async ({ sellerId, fromId, postId }) => {
  if (!sellerId || !postId || !fromId) return false;

  try {
    // Fetch post info
    const postSnap = await getDoc(doc(db, "Posts", postId));
    if (!postSnap.exists()) return false;
    const postData = postSnap.data();

    // Fetch sender info
    const fromSnap = await getDoc(doc(db, "Users", fromId));
    if (!fromSnap.exists()) return false;
    const fromData = fromSnap.data();

    await addDoc(collection(db, "Users", sellerId, "notifications"), {
      type: "order",
      title: postData.title || "Untitled",
      from: fromData.username || "Someone",
      message: "New Order",
      link: `/seller`,
      read: false,
      createdAt: serverTimestamp(),
    });

    console.log("Order notification sent!");
    return true;
  } catch (err) {
    console.error("Error sending order notification:", err);
    return false;
  }
};

export default sendNotificationOrder;