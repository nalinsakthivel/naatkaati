export type NewYearLabel = 'thai' | 'chithirai';

const THAI = 10;
const CHITHIRAI = 1;

/**
 * Cultural label only: which Tamil date is called Tamil New Year in the UI. Official holiday data
 * (14 April is "Tamil New Year's Day" in the G.O.) is never changed by this setting.
 */
export function isTamilNewYear(tamilMonth: number, tamilDay: number, label: NewYearLabel): boolean {
  const month = label === 'thai' ? THAI : CHITHIRAI;
  return tamilMonth === month && tamilDay === 1;
}
