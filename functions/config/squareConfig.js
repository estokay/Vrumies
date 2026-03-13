import { defineSecret } from "firebase-functions/params";

// Define your ACCESS_TOKENs
export const SQUARE_ACCESS_TOKEN_SANDBOX = defineSecret("SQUARE_ACCESS_TOKEN_SANDBOX");
export const SQUARE_ACCESS_TOKEN_PRODUCTION = defineSecret("SQUARE_ACCESS_TOKEN_PRODUCTION");

// Define your LOCATION_UDS
export const SQUARE_LOCATION_ID_SANDBOX = defineSecret("SQUARE_LOCATION_ID_SANDBOX");
export const SQUARE_LOCATION_ID_PRODUCTION = defineSecret("SQUARE_LOCATION_ID_PRODUCTION");

// Mode switch: "SANDBOX" or "PRODUCTION"
export const SQUARE_MODE = "SANDBOX"; // change to "PRODUCTION" in production and "SANDBOX" for sandboxing

// Function to get the correct ACCESS_TOKEN
export async function getSquareAccessToken() {
  if (SQUARE_MODE === "PRODUCTION") {
    return await SQUARE_ACCESS_TOKEN_PRODUCTION.value();
  } else {
    return await SQUARE_ACCESS_TOKEN_SANDBOX.value();
  }
}

// Function to get the correct LOCATION_ID
export async function getSquareLocationId() {
  if (SQUARE_MODE === "PRODUCTION") {
    return await SQUARE_LOCATION_ID_PRODUCTION.value();
  } else {
    return await SQUARE_LOCATION_ID_SANDBOX.value();
  }
}