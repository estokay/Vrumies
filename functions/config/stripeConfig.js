import { defineSecret } from "firebase-functions/params";
import { getFirestore } from "firebase-admin/firestore";

// Define secrets
export const STRIPE_SECRET_TEST = defineSecret("STRIPE_SECRET_TEST");
export const STRIPE_SECRET_LIVE = defineSecret("STRIPE_SECRET_LIVE");

export async function getStripeSecretKey() {
  const db = getFirestore();

  const snap = await db
    .collection("SystemConfig")
    .doc("PaymentProcessors")
    .get();

  if (!snap.exists) {
    throw new Error("PaymentProcessors config missing");
  }

  const mode = snap.data().Stripe;

  if (!mode) {
    throw new Error("Stripe mode not set in config");
  }

  // Decide which secret to use
  if (mode === "LIVE") {
    return await STRIPE_SECRET_LIVE.value();
  } else {
    return await STRIPE_SECRET_TEST.value();
  }
}