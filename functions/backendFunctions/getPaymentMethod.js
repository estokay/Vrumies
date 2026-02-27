import * as functions from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import Stripe from "stripe";
import cors from "cors";

// Initialize secret and CORS handler
const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");
const corsHandler = cors({ origin: true });

export const getPaymentMethod = functions.onRequest(
  { secrets: [STRIPE_SECRET_KEY] },
  (req, res) => {
    // Handle CORS
    corsHandler(req, res, async () => {
      try {
        // Only allow POST requests
        if (req.method !== "POST") {
          return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { paymentIntentId } = req.body;
        if (!paymentIntentId || typeof paymentIntentId !== "string") {
          return res.status(400).json({ error: "Valid paymentIntentId is required" });
        }

        // Initialize Stripe
        const stripe = new Stripe(await STRIPE_SECRET_KEY.value(), {
          apiVersion: "2023-10-16",
        });

        // Retrieve PaymentIntent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        const paymentMethodId = paymentIntent.payment_method;

        if (typeof paymentMethodId !== "string") {
          return res.status(500).json({ error: "Invalid payment method ID" });
        }

        // Retrieve PaymentMethod
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

        // Respond with last 4 digits
        return res.status(200).json({
          last4: paymentMethod.card?.last4 || "N/A",
        });

      } catch (err) {
        console.error("Stripe error:", err);

        // Safely extract error message
        let message = "Unknown error";
        if (err && typeof err === "object" && "message" in err) {
          message = err.message;
        }

        return res.status(500).json({ error: message });
      }
    });
  }
);