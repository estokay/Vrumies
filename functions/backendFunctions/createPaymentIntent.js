import * as functions from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import cors from "cors";
import Stripe from "stripe";

initializeApp();

const corsHandler = cors({ origin: true });
const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");

export const createPaymentIntent = functions.onRequest(
  { secrets: [STRIPE_SECRET_KEY] },
  async (req, res) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      return res.status(204).send("");
    }

    corsHandler(req, res, async () => {
      try {
        if (req.method !== "POST") {
          return res.status(405).json({ error: "Method Not Allowed" });
        }

        // 🔐 Verify Firebase ID token
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const idToken = authHeader.split("Bearer ")[1];
        const decodedToken = await getAuth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // 🔍 Get amount, currency, and optional metadata from request body
        const { amount, currency = "usd", metadata = {} } = req.body;

        if (!amount || typeof amount !== "number" || amount <= 0) {
          return res.status(400).json({ error: "Missing or invalid amount." });
        }

        // Add uid to metadata for verification later
        const stripeMetadata = { ...metadata, uid };

        const stripe = new Stripe(await STRIPE_SECRET_KEY.value(), {
          apiVersion: "2023-10-16",
        });

        // 🔐 Create a new PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency,
          metadata: stripeMetadata,
        });

        // ✅ Return client secret for the frontend
        return res.status(200).json({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        });
      } catch (err) {
        console.error("Stripe error:", err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return res.status(500).json({ error: message });
      }
    });
  }
);