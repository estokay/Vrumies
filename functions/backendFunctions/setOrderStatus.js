import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { updateOrderStatus } from "./updateOrderStatus.js";

initializeApp();
const db = getFirestore();

export const setOrderStatus = onCall(async (request) => {
    console.log("🔥 setOrderStatus triggered");
    console.log("Incoming data:", request.data);
    console.log("Auth UID:", request.auth?.uid);

  const {
    orderId,
    buyerPressedCompleted,
    sellerPressedCompleted,
    buyerPressedDispute,
    sellerPressedDispute,
  } = request.data;

  // 🔐 Authentication is automatic in onCall
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "User not authenticated");
  }

  if (!orderId) {
    throw new HttpsError("invalid-argument", "orderId is required");
  }

  const orderRef = db.collection("Orders").doc(orderId);
  const orderSnap = await orderRef.get();

  if (!orderSnap.exists) {
    throw new HttpsError("not-found", "Order not found");
  }

  const orderData = orderSnap.data();
  const updates = {};

  // ================= BUYER LOGIC =================
  if (
    buyerPressedCompleted !== undefined ||
    buyerPressedDispute !== undefined
  ) {
    const buyerId = orderData?.buyerInfo?.buyerId;

    if (uid !== buyerId) {
      throw new HttpsError("permission-denied", "Not authorized as buyer");
    }

    if (buyerPressedCompleted !== undefined) {
      updates["buyerInfo.buyerMarkedCompleted"] =
        buyerPressedCompleted;
    }

    if (buyerPressedDispute !== undefined) {
      updates["buyerInfo.buyerDispute"] =
        buyerPressedDispute;
    }
  }

  // ================= SELLER LOGIC =================
  if (
    sellerPressedCompleted !== undefined ||
    sellerPressedDispute !== undefined
  ) {
    const sellerId = orderData?.sellerInfo?.sellerId;

    if (uid !== sellerId) {
      throw new HttpsError("permission-denied", "Not authorized as seller");
    }

    if (sellerPressedCompleted !== undefined) {
      updates["sellerInfo.sellerMarkedCompleted"] =
        sellerPressedCompleted;
    }

    if (sellerPressedDispute !== undefined) {
      updates["sellerInfo.sellerDispute"] =
        sellerPressedDispute;
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new HttpsError(
      "invalid-argument",
      "No valid fields provided for update"
    );
  }

  await orderRef.update(updates);
  await updateOrderStatus(orderId);

  return { success: true };
});