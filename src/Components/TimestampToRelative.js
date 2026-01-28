// TimestampToRelative.js
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const UNITS = [
  { label: 'year', seconds: 31536000 },
  { label: 'month', seconds: 2592000 },
  { label: 'day', seconds: 86400 },
  { label: 'hour', seconds: 3600 },
  { label: 'minute', seconds: 60 },
  { label: 'second', seconds: 1 },
];

const TimestampToRelative = ({ timestamp }) => {
  const [relative, setRelative] = useState('');

  const normalizeTimestamp = (ts) => {
    if (!ts) return null;

    // Firestore Timestamp
    if (typeof ts === 'object' && ts.seconds !== undefined) {
      return dayjs(ts.seconds * 1000 + ts.nanoseconds / 1e6);
    }

    // JS Date
    if (ts instanceof Date) {
      return dayjs(ts);
    }

    // String fallback
    if (typeof ts === 'string') {
      return dayjs(ts);
    }

    return null;
  };

  const computeRelative = () => {
    const dt = normalizeTimestamp(timestamp);
    if (!dt || !dt.isValid()) return 'Invalid date';

    const now = dayjs();
    let diffSeconds = Math.floor(now.diff(dt, 'second'));

    if (diffSeconds < 0) diffSeconds = 0;

    for (const unit of UNITS) {
      const value = Math.floor(diffSeconds / unit.seconds);
      if (value >= 1) {
        return `${value} ${unit.label}${value !== 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  };

  useEffect(() => {
    setRelative(computeRelative());

    const interval = setInterval(() => {
      setRelative(computeRelative());
    }, 60000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span>{relative}</span>;
};

export default TimestampToRelative;
