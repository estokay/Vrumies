import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

export const spendUserTokens = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be signed in.");
  }

  const { amount } = request.data;

  if (typeof amount !== "number" || amount <= 0) {
    throw new HttpsError("invalid-argument", "Amount must be a positive number.");
  }

  const userRef = db.collection("Users").doc(uid);

  await db.runTransaction(async (transaction) => {
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists) {
      throw new HttpsError("not-found", "User document not found.");
    }

    const currentTokens = userSnap.data()?.tokens || 0;
    const newTotal = currentTokens - amount; // subtract tokens

    if (newTotal < 0) {
      throw new HttpsError("failed-precondition", "Insufficient tokens.");
    }

    transaction.update(userRef, { tokens: newTotal });
  });

  return { success: true, newTotal: (await userRef.get()).data()?.tokens };
});