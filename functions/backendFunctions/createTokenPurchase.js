import * as functions from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import Stripe from "stripe";
import cors from "cors";

initializeApp();
const db = getFirestore();

// Your Stripe secret key
const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");

// Enable CORS
const corsHandler = cors({ origin: true });

export const createTokenPurchase = functions.onRequest(
  { secrets: [STRIPE_SECRET_KEY] },
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

        // Authenticate Firebase user
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        const idToken = authHeader.split("Bearer ")[1];
        const decodedToken = await getAuth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // Get quantity from request
        const { quantity } = req.body;
        if (!quantity || typeof quantity !== "number" || quantity <= 0) {
          return res.status(400).json({ error: "Invalid quantity." });
        }

        const pricePerToken = 25; // cents per token
        const amount = quantity * pricePerToken;

        // Initialize Stripe
        const stripe = new Stripe(await STRIPE_SECRET_KEY.value(), {
          apiVersion: "2023-10-16",
        });

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: "usd",
          automatic_payment_methods: { enabled: true },
          metadata: { uid, quantity: quantity.toString() },
        });

        // Immediately credit tokens in Firestore
        const userRef = db.collection("Users").doc(uid);
        await db.runTransaction(async (transaction) => {
          const userSnap = await transaction.get(userRef);
          const currentTokens = userSnap.data()?.tokens || 0;
          transaction.update(userRef, { tokens: currentTokens + quantity });

          // Log purchase history
          transaction.set(userRef.collection("TokenPurchaseHistory").doc(), {
            vbt: quantity,
            price: amount / 100,
            stripePaymentIntentId: paymentIntent.id,
            createdAt: Timestamp.now(),
          });
        });

        res.set("Access-Control-Allow-Origin", "*");
        return res.status(200).json({ clientSecret: paymentIntent.client_secret });
      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return res.status(500).json({ error: message });
      }
    });
  }
);