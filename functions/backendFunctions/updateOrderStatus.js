import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

/**
 * Updates the orderStatus based on buyer/seller completed/dispute flags.
 * Can be called internally from other Cloud Functions.
 *
 * @param {string} orderId
 * @returns {Promise<string>} new orderStatus
 */
export async function updateOrderStatus(orderId) {
  if (!orderId || typeof orderId !== "string") {
    throw new Error("Invalid orderId");
  }

  const orderRef = db.collection("Orders").doc(orderId);
  const orderSnap = await orderRef.get();

  if (!orderSnap.exists) {
    throw new Error("Order not found");
  }

  const orderData = orderSnap.data();

  const orderStatus = orderData.orderStatus;
  const buyerInfo = orderData.buyerInfo || {};
  const sellerInfo = orderData.sellerInfo || {};
  const paymentInfo = orderData.paymentInfo || {};

  // Ensure paymentInfo.payoutTransfer exists
  if (paymentInfo.payoutTransfer === undefined) {
    paymentInfo.payoutTransfer = false;
    await orderRef.update({ paymentInfo });
  }

  const buyerCompleted = buyerInfo.buyerMarkedCompleted || false;
  const sellerCompleted = sellerInfo.sellerMarkedCompleted || false;
  const buyerDispute = buyerInfo.buyerDispute || false;
  const sellerDispute = sellerInfo.sellerDispute || false;

  let newStatus = orderStatus || "pending";

  if (orderStatus === "disputed") {
    // do nothing
  } else if (orderStatus === "completed") {
    if (buyerDispute || sellerDispute) {
      newStatus = "disputed";
    }
  } else if (orderStatus === "in_progress") {
    if (buyerDispute || sellerDispute) {
      newStatus = "disputed";
    } else if (
      buyerCompleted &&
      !buyerDispute &&
      sellerCompleted &&
      !sellerDispute
    ) {
      newStatus = "completed";
    }
  } else if (orderStatus === "pending") {
    if (buyerDispute || sellerDispute) {
      newStatus = "disputed";
    } else if (
      buyerCompleted &&
      !buyerDispute &&
      sellerCompleted &&
      !sellerDispute
    ) {
      newStatus = "completed";
    } else if (
      (buyerCompleted && !buyerDispute && !sellerCompleted && !sellerDispute) ||
      (!buyerCompleted && !buyerDispute && sellerCompleted && !sellerDispute)
    ) {
      newStatus = "in_progress";
    }
  }

  if (newStatus !== orderStatus || orderData.orderStatus === undefined) {
    await orderRef.update({ orderStatus: newStatus });
  }

  return newStatus;
}