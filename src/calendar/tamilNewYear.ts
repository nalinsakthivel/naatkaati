export type NewYearLabel = 'thai' | 'chithirai';

const THAI = 10;
const CHITHIRAI = 1;

export function isTamilNewYear(tamilMonth: number, tamilDay: number, label: NewYearLabel): boolean {
  const month = label === 'thai' ? THAI : CHITHIRAI;
  return tamilMonth === month && tamilDay === 1;
}
