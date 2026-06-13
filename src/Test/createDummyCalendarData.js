import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../Components/firebase";

const dateTimeslots = {
    "2026-06-12": [
        {
        startTime: "11:15",
        endTime: "13:30",
        status: "available",
        },
        {
        startTime: "14:00",
        endTime: "15:00",
        status: "available",
        },
    ],

    "2026-06-13": [
        {
        startTime: "08:00",
        endTime: "09:00",
        status: "available",
        },
        {
        startTime: "10:30",
        endTime: "12:00",
        status: "available",
        },
        {
        startTime: "17:00",
        endTime: "18:30",
        status: "available",
        },
    ],

    "2026-06-14": [
        {
        startTime: "09:15",
        endTime: "10:00",
        status: "available",
        },
        {
        startTime: "13:00",
        endTime: "15:00",
        status: "available",
        },
    ],
};

const createDummyCalendarData = async (sellerId = "dummySeller123") => {
  try {
    // Create calendar document
    const calendarRef = await addDoc(
      collection(db, "AvailabilityCalendars"),
      {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        sellerId,
        createdAt: serverTimestamp(),
      }
    );

    // Sample dates
    const dates = Object.keys(dateTimeslots);

    for (const date of dates) {
      const dateRef = doc(
        db,
        "AvailabilityCalendars",
        calendarRef.id,
        "dates",
        date
      );

      // Create date document
      await setDoc(dateRef, {});

      const timeslots = dateTimeslots[date];

      for (const timeslot of timeslots) {
        await addDoc(
          collection(
            db,
            "AvailabilityCalendars",
            calendarRef.id,
            "dates",
            date,
            "timeslots"
          ),
          timeslot
        );
      }
    }

    console.log(
      `Dummy calendar created successfully: ${calendarRef.id}`
    );

    return calendarRef.id;
  } catch (error) {
    console.error("Error creating dummy calendar:", error);
    throw error;
  }
};

export default createDummyCalendarData;