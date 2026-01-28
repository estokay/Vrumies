import { useMemo } from 'react';
import moment from 'moment-timezone';

const useGetTimezoneTime = (dateTime, timezone, format = 'h:mm A z') => {
  return useMemo(() => {
    if (!dateTime || !timezone) return '';

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

export default useGetTimezoneTime;
