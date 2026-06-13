// Hooks/useGetAvailabilityCalendar.js

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Components/firebase";

export default function useGetAvailabilityCalendar() {
  const { id } = useParams();

  const [availabilityCalendarId, setAvailabilityCalendarId] = useState(null);
  const [availabilityCalendarExists, setAvailabilityCalendarExists] =
    useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailabilityCalendar = async () => {
      if (!id) {
        setAvailabilityCalendarId(null);
        setAvailabilityCalendarExists(false);
        setLoading(false);
        return;
      }

      try {
        const postRef = doc(db, "Posts", id);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
          setAvailabilityCalendarId(null);
          setAvailabilityCalendarExists(false);
          return;
        }

        const data = postSnap.data();

        if (
          typeof data.availabilityCalendarId === "string" &&
          data.availabilityCalendarId.trim() !== ""
        ) {
          setAvailabilityCalendarId(data.availabilityCalendarId);
          setAvailabilityCalendarExists(true);
        } else {
          setAvailabilityCalendarId(null);
          setAvailabilityCalendarExists(false);
        }
      } catch (error) {
        console.error("Error fetching availability calendar:", error);
        setAvailabilityCalendarId(null);
        setAvailabilityCalendarExists(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilityCalendar();
  }, [id]);

  return {
    availabilityCalendarId,
    availabilityCalendarExists,
    loading,
  };
}