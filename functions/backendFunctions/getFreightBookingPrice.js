import * as functions from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import fetch from "node-fetch";
import cors from "cors";

const corsHandler = cors({ origin: true });
const DISTANCE_MATRIX_API_KEY = defineSecret("DISTANCE_MATRIX_API_KEY");

export const getFreightBookingPrice = functions.onRequest(
  { secrets: [DISTANCE_MATRIX_API_KEY] },
  async (req, res) => {
    corsHandler(req, res, async () => {
      const { pickupAddress, dropoffAddress, rpm } = req.query;

      // Validate inputs
      if (!pickupAddress || !dropoffAddress || !rpm) {
        return res.status(400).json({ error: "Missing pickupAddress, dropoffAddress, or rpm" });
      }

      const ratePerMile = parseFloat(rpm);
      if (isNaN(ratePerMile)) {
        return res.status(400).json({ error: "Invalid rpm value" });
      }

      try {
        const apiKey = await DISTANCE_MATRIX_API_KEY.value();

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
          pickupAddress
        )}&destinations=${encodeURIComponent(
          dropoffAddress
        )}&units=imperial&avoid=tolls&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "OK") {
          return res.status(500).json({ error: data.error_message || "Google API error" });
        }

        // Get distance in miles
        const element = data.rows[0].elements[0];
        if (element.status !== "OK") {
          return res.status(500).json({ error: "Invalid route" });
        }

        const distanceValue = element.distance.value; // meters
        const distanceMiles = distanceValue / 1609.34;

        // Calculate total price
        const price = parseFloat((distanceMiles * ratePerMile).toFixed(2));

        res.json({ distanceMiles: distanceMiles.toFixed(2), price });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }
);