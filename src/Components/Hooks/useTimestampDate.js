import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const HOUSTON_TZ = 'America/Chicago';

export default function useTimestampDate(timestamp) {
  const [dateString, setDateString] = useState('');

  const computeDate = () => {
    if (!timestamp) return '';

    // Remove non-breaking spaces
    const cleaned = timestamp.replace(/\u202F|\u00A0/g, ' ');

    // Convert "UTC-6" → "-06:00" (ISO offset)
    const withOffset = cleaned.replace(/UTC([+-]\d{1,2})/, (_, h) => {
      const hour = h.padStart(2, '0');
      return `${h[0] === '-' ? '-' : '+'}${hour}:00`;
    });

    // Parse in Houston timezone
    const date = dayjs.tz(withOffset, 'MMMM D, YYYY [at] h:mm:ss A Z', HOUSTON_TZ);

    // Format as "MARCH 28, 2026"
    return date.format('MMMM D, YYYY').toUpperCase();
  };

  useEffect(() => {
    setDateString(computeDate());
  }, [timestamp]);

  return dateString;
}