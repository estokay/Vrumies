import { useState, useEffect } from "react";

/**
 * Converts a timestamp to a formatted date string in browser local timezone
 * Format: "JANUARY 23, 2026"
 * @param {string | Date | number} createdAt - The timestamp to convert
 * @returns {string} - Formatted date string or empty string if invalid
 */
export default function useTimestampObjectToDate(createdAt) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (!createdAt || !createdAt.toDate) {
      setFormattedDate("");
      return;
    }

    const parsedDate = createdAt.toDate();

    if (!parsedDate || isNaN(parsedDate.getTime())) {
      setFormattedDate("");
      return;
    }

    // Format as "MONTH DAY, YEAR" in all caps
    const options = { year: "numeric", month: "long", day: "numeric" };
    const localString = parsedDate.toLocaleDateString(undefined, options).toUpperCase();

    setFormattedDate(localString);
  }, [createdAt]);

  return formattedDate;
}