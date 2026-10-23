import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

const REFRESH_INTERVAL_MS = 60_000;

/** Keep visible dates current within a minute, and catch up immediately after backgrounding. */
export function useClock(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = setInterval(refresh, REFRESH_INTERVAL_MS);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, []);
  return now;
}
