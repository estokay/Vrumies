import { defineSecret } from "firebase-functions/params";

// Define your secrets
export const STRIPE_SECRET_TEST = defineSecret("STRIPE_SECRET_TEST");
export const STRIPE_SECRET_LIVE = defineSecret("STRIPE_SECRET_LIVE");

// Mode switch: "test" or "live"
export const STRIPE_MODE = "test"; // change to "live" in production and "test" for testing

// Function to get the correct secret
export async function getStripeSecretKey() {
  if (STRIPE_MODE === "live") {
    return await STRIPE_SECRET_LIVE.value();
  } else {
    return await STRIPE_SECRET_TEST.value();
  }
}