import * as functions from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import Stripe from "stripe";
import cors from "cors";
import { getStripeSecretKey } from "../config/stripeConfig.js";

initializeApp();

const corsHandler = cors({ origin: true });

export const createTokenPurchase = functions.onRequest(
  { secrets: [] },
  async (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method === "OPTIONS") {
          res.set("Access-Control-Allow-Origin", "*");
          res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
          res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
          return res.status(204).send("");
        }

        if (req.method !== "POST") {
          return res.status(405).json({ error: "Method Not Allowed" });
        }

        // Verify Firebase user
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        const idToken = authHeader.split("Bearer ")[1];
        const decodedToken = await getAuth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const { quantity } = req.body;
        if (!quantity || typeof quantity !== "number" || quantity <= 0) {
          return res.status(400).json({ error: "Invalid quantity." });
        }

        const pricePerToken = 25; // cents per token
        const amount = quantity * pricePerToken;

        const stripe = new Stripe(await getStripeSecretKey(), {
          apiVersion: "2023-10-16",
        });

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: "usd",
          automatic_payment_methods: { enabled: true },
          metadata: { uid, quantity: quantity.toString() },
        });

        res.set("Access-Control-Allow-Origin", "*");
        return res.status(200).json({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        });
      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return res.status(500).json({ error: message });
      }
    });
  }
);