import * as functions from "firebase-functions/v2/https";
import cors from "cors";
import Stripe from "stripe";
import { defineSecret } from "firebase-functions/params";

const corsHandler = cors({ origin: true });
const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");

export const getSellerBalance = functions.onRequest(
  { secrets: [STRIPE_SECRET_KEY] }, // include the secret
  async (req, res) => {
    corsHandler(req, res, async () => {
      try {
        const { stripeAccountId } = req.query;

        if (!stripeAccountId) {
          return res.status(400).json({ error: "Missing stripeAccountId" });
        }

        // Create the Stripe instance inside the function
        const stripe = new Stripe(await STRIPE_SECRET_KEY.value(), {
          apiVersion: "2023-10-16",
        });

        const balance = await stripe.balance.retrieve({
          stripeAccount: stripeAccountId,
        });

        res.json(balance);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || "Internal error" });
      }
    });
  }
);