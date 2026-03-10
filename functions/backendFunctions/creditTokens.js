import * as functions from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import Stripe from "stripe";
import cors from "cors";
import { getStripeSecretKey } from "../config/stripeConfig.js";

initializeApp();
const db = getFirestore();
const corsHandler = cors({ origin: true });

export const creditTokens = functions.onRequest(
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

        const { paymentIntentId } = req.body;
        if (!paymentIntentId || typeof paymentIntentId !== "string") {
          return res.status(400).json({ error: "paymentIntentId is required." });
        }

        const stripe = new Stripe(await getStripeSecretKey(), {
          apiVersion: "2023-10-16",
        });

        // Retrieve PaymentIntent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== "succeeded") {
          return res.status(400).json({ error: "Payment has not succeeded." });
        }

        const quantity = parseInt(paymentIntent.metadata.quantity || "0");
        if (quantity <= 0) {
          return res.status(400).json({ error: "Invalid quantity in metadata." });
        }

        // Credit tokens in Firestore
        const userRef = db.collection("Users").doc(uid);
        await db.runTransaction(async (transaction) => {
          const userSnap = await transaction.get(userRef);
          const currentTokens = userSnap.data()?.tokens || 0;
          transaction.update(userRef, { tokens: currentTokens + quantity });

          // Log purchase history
          transaction.set(userRef.collection("TokenPurchaseHistory").doc(), {
            vbt: quantity,
            price: paymentIntent.amount / 100,
            stripePaymentIntentId: paymentIntent.id,
            createdAt: Timestamp.now(),
          });
        });

        return res.status(200).json({ success: true, tokensAdded: quantity });
      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return res.status(500).json({ error: message });
      }
    });
  }
);