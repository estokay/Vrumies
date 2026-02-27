// useTimestampRelative.js
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const HOUSTON_TZ = 'America/Chicago';

export default function useTimestampRelative(timestamp) {
  const [relative, setRelative] = useState('');

  const computeRelative = () => {
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
    const diff = dayjs().diff(date, 'second'); // difference in seconds

    let value = '';
    if (diff < 60) value = `${diff}s`;
    else {
      const minutes = Math.floor(diff / 60);
      if (minutes < 60) value = `${minutes}m`;
      else {
        const hours = Math.floor(minutes / 60);
        if (hours < 24) value = `${hours}h`;
        else {
          const days = Math.floor(hours / 24);
          if (days < 7) value = `${days}d`;
          else {
            const weeks = Math.floor(days / 7);
            if (weeks < 4) value = `${weeks}w`;
            else {
              const months = Math.floor(days / 30);
              if (months < 12) value = `${months}mo`;
              else {
                const years = Math.floor(days / 365);
                value = `${years}y`;
              }
            }
          }
        }
      }
    }

    return `${value} ago`;
  };

  useEffect(() => {
    setRelative(computeRelative());

    // Update every 1 minute
    const interval = setInterval(() => {
      setRelative(computeRelative());
    }, 60000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return relative;
}