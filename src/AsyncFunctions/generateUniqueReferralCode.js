// utils/referral.js
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Components/firebase"; // adjust path if needed

const generateUniqueReferralCode = async () => {
  let code;
  let exists = true;
  let maxAttempts = 20;
  let attempts = 0;

  while (exists && attempts < maxAttempts) {
    code = "VRM" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const q = await getDocs(
      query(collection(db, "Users"), where("referralCode", "==", code))
    );

    exists = !q.empty;
    attempts++;
  }

  if (exists) {
    throw new Error("Failed to generate unique referral code after 20 attempts");
  }

  return code;
};

export default generateUniqueReferralCode;