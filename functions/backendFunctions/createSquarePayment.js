import { onRequest } from "firebase-functions/v2/https";
import { SquareClient, SquareEnvironment } from "square";
import crypto from "crypto";
import cors from "cors";

const corsHandler = cors({ origin: true });

const SQUARE_MODE = "SANDBOX"; // change to "PRODUCTION" in production

export const createSquarePayment = onRequest(
  {
    secrets: [
      "SQUARE_ACCESS_TOKEN_SANDBOX",
      "SQUARE_ACCESS_TOKEN_PRODUCTION",
      "SQUARE_LOCATION_ID_SANDBOX",
      "SQUARE_LOCATION_ID_PRODUCTION",
    ],
  },
  async (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method === "OPTIONS") {
          res.set("Access-Control-Allow-Methods", "POST");
          res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
          return res.status(204).send("");
        }

        if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

        const { amount, nonce, idempotencyKey } = req.body;
        if (!amount || !nonce || !idempotencyKey) {
          return res.status(400).json({ error: "Missing fields" });
        }

        const authHeader = req.headers.authorization || "";
        if (!authHeader.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });

        const isProd = SQUARE_MODE === "PRODUCTION";
        const accessToken = isProd ? process.env.SQUARE_ACCESS_TOKEN_PRODUCTION : process.env.SQUARE_ACCESS_TOKEN_SANDBOX;
        const locationId = isProd ? process.env.SQUARE_LOCATION_ID_PRODUCTION : process.env.SQUARE_LOCATION_ID_SANDBOX;
        const environment = isProd ? SquareEnvironment.Production : SquareEnvironment.Sandbox;

        const squareClient = new SquareClient({ environment, token: accessToken });

        // In the NEW SDK, 'response' contains the payment data directly.
        // If there's an API error (like invalid card), it will THROW and go to the catch block.
        const response = await squareClient.payments.create({
          sourceId: nonce,
          idempotencyKey: idempotencyKey,
          locationId,
          amountMoney: { amount: BigInt(amount), currency: "USD" },
        });

        // The payment object is directly in 'response' or 'response.payment'
        const paymentData = response.payment || response;

        if (!paymentData) {
           throw new Error("Square API returned an empty response.");
        }

        // Handle BigInt for JSON serialization
        const serializedPayment = JSON.parse(
          JSON.stringify(paymentData, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        );

        res.status(200).json({ payment: serializedPayment });

      } catch (err) {
        console.error("FULL ERROR LOG:", err);
        
        // Robust error parsing: Check if it's a Square API error or a standard JS error
        let errorMessage = "An internal server error occurred.";
        
        if (err.errors && err.errors.length > 0) {
          errorMessage = err.errors[0].detail; // Square API error message
        } else if (err.message) {
          errorMessage = err.message; // Standard JS error message
        }

        res.status(500).json({ error: errorMessage });
      }
    });
  }
);