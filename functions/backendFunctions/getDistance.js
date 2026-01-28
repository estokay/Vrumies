import * as functions from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import fetch from "node-fetch";
import cors from "cors";

const corsHandler = cors({ origin: true });
const DISTANCE_MATRIX_API_KEY = defineSecret("DISTANCE_MATRIX_API_KEY");

export const getDistance = functions.onRequest(
  { secrets: [DISTANCE_MATRIX_API_KEY] },
  async (req, res) => {
    corsHandler(req, res, async () => {
      const { pickupAddress, dropoffAddress } = req.query;

      if (!pickupAddress || !dropoffAddress) {
        return res.status(400).json({ error: "Missing addresses" });
      }

      try {
        // Access the secret asynchronously
        const apiKey = await DISTANCE_MATRIX_API_KEY.value();

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
          pickupAddress
        )}&destinations=${encodeURIComponent(
          dropoffAddress
        )}&units=imperial&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "OK") {
          return res
            .status(500)
            .json({ error: data.error_message || "Google API error" });
        }

        res.json(data);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }
);