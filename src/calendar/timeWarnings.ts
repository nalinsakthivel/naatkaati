import { TZDate } from '@date-fns/tz';

export interface TimeStatus {
  autoTime: boolean;
  autoTimeZone: boolean;
}

export interface TimeWarnings {
  /** Automatic date/time or timezone is off, so the device clock may be wrong */
  autoTimeOff: boolean;
  /** The device timezone differs from the selected location's, so the shown date is the location's */
  timezoneDiffers: boolean;
}

/** Compares UTC offsets at `now`, so aliases like Asia/Kolkata and Asia/Calcutta never count as different. */
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
