import * as functions from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import cors from "cors";
import Stripe from "stripe";

const corsHandler = cors({ origin: true });
const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");

export const createPaymentIntent = functions.onRequest(
  { secrets: [STRIPE_SECRET_KEY] },
  async (req, res) => {
    corsHandler(req, res, async () => {
      try {
        const { amount, currency = "usd", metadata, transferGroup } = req.body;

        if (!amount) {
          return res.status(400).json({ error: "Missing amount" });
        }

        const stripe = new Stripe(await STRIPE_SECRET_KEY.value(), {
          apiVersion: "2023-10-16",
        });

        // DIRECT CHARGE - remove transfer_data
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount), // amount in cents
          currency,
          automatic_payment_methods: { enabled: true },
          metadata: metadata || {},
          transfer_group: transferGroup || undefined,
        });

        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (err: any) {
        console.error("Stripe error:", err);
        res.status(500).json({ error: err.message });
      }
    });
  }
);