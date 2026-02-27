import { useMemo } from 'react';
import moment from 'moment-timezone';

const useGetTimezoneDate = (dateTime, timezone, format = 'MMM D, YYYY') => {
  return useMemo(() => {
    if (!dateTime || !timezone) return '';

    // Firestore Timestamp → seconds
    const seconds =
      dateTime?.seconds ??
      (dateTime instanceof Date ? Math.floor(dateTime.getTime() / 1000) : null);

    if (!seconds) return '';

    return moment
      .unix(seconds)
      .tz(timezone)
      .format(format);
  }, [dateTime, timezone, format]);
};

export default useGetTimezoneDate;
