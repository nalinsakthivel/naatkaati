import { TZDate } from '@date-fns/tz';

export interface TimeStatus {
  autoTime: boolean;
  autoTimeZone: boolean;
}

export interface TimeWarnings {
  autoTimeOff: boolean;
  timezoneDiffers: boolean;
}

export function getTimeWarnings(
  status: TimeStatus,
  deviceTimeZone: string | null,
  locationTimeZone: string,
  now: Date,
): TimeWarnings {
  const timezoneDiffers =
    deviceTimeZone !== null &&
    new TZDate(now, deviceTimeZone).getTimezoneOffset() !==
      new TZDate(now, locationTimeZone).getTimezoneOffset();
  return { autoTimeOff: !status.autoTime || !status.autoTimeZone, timezoneDiffers };
}
